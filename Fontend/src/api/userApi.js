import axios from "axios";

const BASE_URL = "http://localhost:3000"; // URL của User-service backend

export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/register`, data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

export const getUserById = async (userId) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // Sửa lại endpoint:
    const res = await axios.get(`${BASE_URL}/users/${userId}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return res.data;
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("❌ Request timeout");
      return { message: "Request timeout" };
    }
    console.error("❌ Get user by ID error:", err);
    return err.response?.data || { message: "Server error" };
  }
};

export const getAllAccounts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/users/all`);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};
