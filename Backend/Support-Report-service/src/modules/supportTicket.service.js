const { PrismaClient } = require("@prisma/client");
const logger = require("../utils/logger");
const prisma = new PrismaClient();

class SupportTicketService {
  // ✅ Normalize status (uppercase ↔ lowercase)
  normalizeStatus(status) {
    return status ? status.toLowerCase() : "open";
  }

  // Tạo ticket mới
  async createTicket(data) {
    try {
      logger.info("Creating ticket", { userId: data.userId });

      const ticket = await prisma.support_tickets.create({
        data: {
          userId: String(data.userId), // ✅ Convert to String
          userRole: data.userRole || "USER",
          title: data.title,
          description: data.description,
          category: data.category || "GENERAL",
          status: this.normalizeStatus(data.status),
          priority: this.normalizeStatus(data.priority),
          attachments: data.attachments || null,
          updated_at: new Date(),
        },
      });

      logger.info("Ticket created", { ticketId: ticket.id });
      return ticket;
    } catch (error) {
      logger.error("Create ticket failed", { error: error.message });
      throw new Error(`Error creating ticket: ${error.message}`);
    }
  }

  // Lấy tất cả tickets
  async getAllTickets(filters = {}) {
    try {
      const { userId, status, category, limit = 50, offset = 0 } = filters;

      const where = {};
      if (userId) where.userId = String(userId); // ✅ Convert to String
      if (status) where.status = this.normalizeStatus(status);
      if (category) where.category = category;

      const tickets = await prisma.support_tickets.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      const total = await prisma.support_tickets.count({ where });

      return {
        tickets,
        pagination: { total, limit: parseInt(limit), offset: parseInt(offset) },
      };
    } catch (error) {
      logger.error("Get tickets failed", { error: error.message });
      throw new Error(`Error fetching tickets: ${error.message}`);
    }
  }

  // Lấy ticket theo ID
  async getTicketById(ticketId) {
    try {
      const ticket = await prisma.support_tickets.findUnique({
        where: { id: String(ticketId) }, // ✅ Convert to String (nếu id là String trong schema)
      });

      if (!ticket) throw new Error("Ticket not found");
      return ticket;
    } catch (error) {
      logger.error("Get ticket failed", { error: error.message });
      throw new Error(`Error fetching ticket: ${error.message}`);
    }
  }

  // UPDATE STATUS
  async updateStatus(ticketId, status) {
    try {
      logger.info("Updating ticket status", { ticketId, status });

      const normalizedStatus = this.normalizeStatus(status);

      const updated = await prisma.support_tickets.update({
        where: { id: String(ticketId) }, // ✅ Convert to String
        data: {
          status: normalizedStatus,
          updated_at: new Date(),
          ...(normalizedStatus === "resolved" || normalizedStatus === "closed"
            ? { resolved_at: new Date() }
            : {}),
        },
      });

      logger.info("Ticket status updated", {
        ticketId,
        status: normalizedStatus,
      });
      return updated;
    } catch (error) {
      logger.error("Update status failed", { error: error.message });
      throw new Error(`Error updating status: ${error.message}`);
    }
  }

  // Cập nhật ticket
  async updateTicket(ticketId, userId, data) {
    try {
      logger.info("Updating ticket", { ticketId, userId });

      const ticket = await prisma.support_tickets.findUnique({
        where: { id: String(ticketId) }, // ✅ Convert to String
      });

      if (!ticket) throw new Error("Ticket not found");

      // Check quyền
      if (ticket.userId !== String(userId) && data.userRole !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const updated = await prisma.support_tickets.update({
        where: { id: String(ticketId) }, // ✅ Convert to String
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.status && { status: this.normalizeStatus(data.status) }),
          ...(data.priority && {
            priority: this.normalizeStatus(data.priority),
          }),
          ...(data.assignedTo && { assignedTo: data.assignedTo }),
          ...(data.response && { response: data.response }),
          ...(data.attachments && { attachments: data.attachments }),
          updated_at: new Date(),
          ...(data.status === "closed" && { resolved_at: new Date() }),
          ...(data.status === "resolved" && { resolved_at: new Date() }),
        },
      });

      logger.info("Ticket updated", { ticketId });
      return updated;
    } catch (error) {
      logger.error("Update ticket failed", { error: error.message });
      throw new Error(`Error updating ticket: ${error.message}`);
    }
  }

  // Xóa ticket
  async deleteTicket(ticketId, userId, userRole) {
    try {
      logger.info("Deleting ticket", { ticketId });

      const ticket = await prisma.support_tickets.findUnique({
        where: { id: String(ticketId) }, // ✅ Convert to String
      });

      if (!ticket) throw new Error("Ticket not found");

      // Check quyền
      if (ticket.userId !== String(userId) && userRole !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      await prisma.support_tickets.delete({
        where: { id: String(ticketId) }, // ✅ Convert to String
      });

      logger.info("Ticket deleted", { ticketId });
      return { success: true, message: "Ticket deleted" };
    } catch (error) {
      logger.error("Delete ticket failed", { error: error.message });
      throw new Error(`Error deleting ticket: ${error.message}`);
    }
  }

  // ✅ CREATE (alias)
  async create(data) {
    return this.createTicket(data);
  }

  // ✅ GETALL (alias) - Trả về format đúng
  async getAll(userId, status) {
    const result = await this.getAllTickets({ userId, status });
    return result.tickets;
  }

  // ✅ DELETE (alias)
  async delete(ticketId) {
    return this.deleteTicket(ticketId, null, "ADMIN");
  }

  // ✅ REPLY (thêm method mới)
  async reply(ticketId, message, userId) {
    try {
      const updated = await prisma.support_tickets.update({
        where: { id: String(ticketId) }, // ✅ Convert to String
        data: {
          response: message,
          updated_at: new Date(),
        },
      });
      return updated;
    } catch (error) {
      logger.error("Reply failed", { error: error.message });
      throw new Error(`Error replying: ${error.message}`);
    }
  }
}

module.exports = new SupportTicketService();
