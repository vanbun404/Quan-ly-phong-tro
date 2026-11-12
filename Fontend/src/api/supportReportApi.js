import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Port của Support-Report-service

// ==================== SUPPORT TICKETS ====================

/**
 * Lấy tất cả support tickets
 */
export const getSupportTickets = async (userId = null, status = null) => {
  try {
    const params = {};
    if (userId) params.userId = userId;
    if (status) params.status = status;

    const res = await axios.get(`${BASE_URL}/api/support-tickets`, { params });
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Tạo support ticket mới
 */
export const createSupportTicket = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/support-tickets`, data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Cập nhật status ticket
 */
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/api/support-tickets/${ticketId}/status`,
      { status }
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Trả lời ticket
 */
export const replyToTicket = async (ticketId, message, userId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/support-tickets/${ticketId}/reply`,
      { message, userId }
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Xóa ticket
 */
export const deleteTicket = async (ticketId) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/api/support-tickets/${ticketId}`
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

// ==================== REPORTS ====================

/**
 * Lấy tất cả reports
 */
export const getReports = async (status = null) => {
  try {
    const params = {};
    if (status) params.status = status;

    const res = await axios.get(`${BASE_URL}/api/reports`, { params });
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Tạo report mới
 */
export const createReport = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/reports`, data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};


export const updateReportStatus = async (
  reportId,
  status,
  resolution = null
) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/api/reports/${reportId}/status`,
      { status, resolution }
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};


export const deleteReport = async (reportId) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/reports/${reportId}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};
