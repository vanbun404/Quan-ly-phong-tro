import axios from "axios";
const BASE_URL = "http://localhost:3000";
export const LoginUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};
