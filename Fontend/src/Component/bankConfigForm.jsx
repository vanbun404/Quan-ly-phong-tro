import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BankConfigForm({ landlordId }) {
  const [form, setForm] = useState({
    bankCode: "",
    bankName: "",
    accountNo: "",
    accountName: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  // 🧠 Lấy dữ liệu hiện tại khi load trang
  useEffect(() => {
    if (!landlordId) return;
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/bank-config/${landlordId}`
        );
        console.log(res);
        if (res.data) {
          setForm({
            bankCode: res.data.bankCode || "",
            bankName: res.data.bankName || "",
            accountNo: res.data.accountNo || "",
            accountName: res.data.accountName || "",
          });
          setHasData(true);
        }
      } catch (err) {
        console.log("⚠️ Chưa có cấu hình ngân hàng cho landlord:", landlordId);
        setHasData(false);
      }
    })();
  }, [landlordId]);

  // 🖊️ Xử lý thay đổi input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Gửi dữ liệu lên backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/bank-config",
        {
          landlordId: Number(landlordId),
          ...form,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(res.data.message || "💾 Lưu thông tin ngân hàng thành công!");
      setHasData(true);
    } catch (err) {
      console.error("❌ Lỗi khi lưu thông tin ngân hàng:", err);
      if (err.response) {
        alert(`💥 Lỗi từ server: ${err.response.data.message}`);
      } else {
        alert("🚫 Lỗi mạng hoặc server không phản hồi!");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🧱 Giao diện
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        🏦 {hasData ? "Cập nhật" : "Thêm"} tài khoản ngân hàng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="bankCode"
          value={form.bankCode}
          onChange={handleChange}
          placeholder="Mã ngân hàng (VD: VCB)"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="bankName"
          value={form.bankName}
          onChange={handleChange}
          placeholder="Tên ngân hàng"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="accountNo"
          value={form.accountNo}
          onChange={handleChange}
          placeholder="Số tài khoản"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="accountName"
          value={form.accountName}
          onChange={handleChange}
          placeholder="Tên chủ tài khoản"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          {loading
            ? "Đang lưu..."
            : hasData
            ? "Cập nhật thông tin"
            : "Lưu thông tin"}
        </button>
      </form>

      {/* ✅ Xem lại dữ liệu hiện tại */}
      {hasData && (
        <div className="mt-6 border-t pt-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-800 mb-2">
            Thông tin hiện tại:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Mã ngân hàng: {form.bankCode}</li>
            <li>Tên ngân hàng: {form.bankName}</li>
            <li>Số tài khoản: {form.accountNo}</li>
            <li>Tên chủ tài khoản: {form.accountName}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
