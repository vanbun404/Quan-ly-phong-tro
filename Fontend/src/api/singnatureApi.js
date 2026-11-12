import axios from "axios";

/**
 * 📤 Upload chữ ký người dùng lên Cloudinary
 * @param {File} file - Ảnh chữ ký (png/jpg/jpeg)
 * @param {number} id - ID người dùng
 * @param {string} role - Vai trò ("USER" hoặc "LANDLORD")
 * @returns {Promise<object>} - Kết quả trả về từ backend
 */
export const uploadSignature = async (file, id, role) => {
  try {
    if (!file) throw new Error("Không có file chữ ký");
    if (!id || !role) throw new Error("Thiếu thông tin người dùng");

    const formData = new FormData();
    formData.append("signature", file);
    formData.append("id", id);
    formData.append("role", role);

    const res = await axios.post("http://localhost:3000/signatures/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data; // Trả về object { message, signatureUrl, updated }
  } catch (error) {
    console.error("❌ Lỗi upload chữ ký:", error);
    throw error.response?.data || { message: "Upload chữ ký thất bại" };
  }
};
