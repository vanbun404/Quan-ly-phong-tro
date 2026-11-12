const { PrismaClient } = require("@prisma/client");
const logger = require("../utils/logger");
const prisma = new PrismaClient();

class ReportService {
  // Tạo report mới
  async createReport(data) {
    try {
      logger.info("Creating report", { reporterId: data.reporterId });

      const report = await prisma.reports.create({
        data: {
          ticket_id: data.ticketId || null,
          reporter_id: data.reporterId,
          reporter_role: data.reporterRole,
          reported_id: data.reportedId || null,
          report_type: data.reportType,
          title: data.title,
          content: data.content,
          evidence: data.evidence || null,
          status: "pending",
          severity: data.severity || "medium",
          updated_at: new Date(),
        },
      });

      logger.success("Report created", { reportId: report.id });
      return report;
    } catch (error) {
      logger.error("Create report failed", { error: error.message });
      throw new Error(`Error creating report: ${error.message}`);
    }
  }

  // Lấy tất cả reports
  async getAllReports(filters = {}) {
    try {
      const {
        reporterId,
        status,
        reportType,
        limit = 50,
        offset = 0,
      } = filters;

      const where = {};
      if (reporterId) where.reporter_id = reporterId;
      if (status) where.status = status;
      if (reportType) where.report_type = reportType;

      const reports = await prisma.reports.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      const total = await prisma.reports.count({ where });

      return {
        reports,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      };
    } catch (error) {
      logger.error("Get reports failed", { error: error.message });
      throw new Error(`Error fetching reports: ${error.message}`);
    }
  }

  // Lấy report theo ID
  async getReportById(reportId) {
    try {
      const report = await prisma.reports.findUnique({
        where: { id: parseInt(reportId) },
      });

      if (!report) throw new Error("Report not found");
      return report;
    } catch (error) {
      logger.error("Get report failed", { error: error.message });
      throw new Error(`Error fetching report: ${error.message}`);
    }
  }

  // Cập nhật report (Admin dùng cho tất cả: update, resolve, dismiss)
  async updateReport(reportId, data) {
    try {
      logger.info("Updating report", { reportId });

      const report = await prisma.reports.findUnique({
        where: { id: parseInt(reportId) },
      });

      if (!report) throw new Error("Report not found");

      const updated = await prisma.reports.update({
        where: { id: parseInt(reportId) },
        data: {
          ...(data.status && { status: data.status }),
          ...(data.severity && { severity: data.severity }),
          ...(data.adminNotes && { admin_notes: data.adminNotes }),
          ...(data.action && { action: data.action }),
          updated_at: new Date(),
          // Nếu status là resolved hoặc dismissed thì set resolvedAt
          ...((data.status === "resolved" || data.status === "dismissed") && {
            resolved_at: new Date(),
          }),
        },
      });

      logger.success("Report updated", { reportId });
      return updated;
    } catch (error) {
      logger.error("Update report failed", { error: error.message });
      throw new Error(`Error updating report: ${error.message}`);
    }
  }

  // Xóa report
  async deleteReport(reportId, userId, userRole) {
    try {
      logger.info("Deleting report", { reportId });

      const report = await prisma.reports.findUnique({
        where: { id: parseInt(reportId) },
      });

      if (!report) throw new Error("Report not found");

      // Check quyền
      if (report.reporter_id !== userId && userRole !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      await prisma.reports.delete({
        where: { id: parseInt(reportId) },
      });

      logger.success("Report deleted", { reportId });
      return { success: true, message: "Report deleted" };
    } catch (error) {
      logger.error("Delete report failed", { error: error.message });
      throw new Error(`Error deleting report: ${error.message}`);
    }
  }
}

module.exports = new ReportService();
