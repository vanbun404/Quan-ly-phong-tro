import axios from "axios";
const BASE_URL = "http://localhost:8000";
export const getAllRooms = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await axios.get(`${API_URL}?${params}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi getAllRooms:", error);
    throw error;
  }
};

export const getRoomById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/search/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi getRoomById:", error);
    throw error;
  }
};

export const createRoom = async (formData) => {
  try {
    const res = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi createRoom:", error);
    throw error;
  }
};

export const updateRoom = async (id, formData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi updateRoom:", error);
    throw error;
  }
};

export const deleteRoom = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi deleteRoom:", error);
    throw error;
  }
};
export const getRoomByOwner = async (ownerId) => {
  try {
    const res = await axios.get(`${API_URL}/owner/${ownerId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi getRoomByOwner:", error);
    throw error;
  }
};
export const getLatestRooms = async () => {
  try {
    const res = await axios.get(`${API_URL}/rooms/latest`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi getLatestRooms:", error);
    throw error;
  }
};
