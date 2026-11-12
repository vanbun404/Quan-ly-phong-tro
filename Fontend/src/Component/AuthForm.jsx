import { useState } from "react";
import bgImage from "../assets/imgs/background.jpg";
import { registerUser } from "../api/userApi";
import { registerLandLord } from "../api/landLordApi";

export default function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (role) => {
    // ✅ role có thể là "USER" hoặc "LANDLORD"
    if (form.password !== form.confirm) {
      setMessage("❌ Mật khẩu không khớp");
      return;
    }

    let res;
    if (role === "USER") {
      res = await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
      });
    } else if (role === "LANDLORD") {
      res = await registerLandLord({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
      });
    }

    setMessage(res.message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay mờ giúp nổi form */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Form */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Đăng ký tài khoản
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Tạo tài khoản mới ngay hôm nay 🚀
        </p>

        {/* Form input */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              pattern="^[0-9]{9,11}$"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              placeholder="VD: 0987654321"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              placeholder="********"
              required
            />
          </div>

          {/* Nhập lại mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              placeholder="********"
              required
            />
          </div>

          {/* ✅ Hai nút đăng ký */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={() => handleRegister("USER")}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
            >
              Đăng ký người dùng
            </button>
            <button
              type="button"
              onClick={() => handleRegister("LANDLORD")}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
            >
              Đăng ký cho thuê
            </button>
          </div>

          {/* Thông báo */}
          {message && (
            <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
          )}

          {/* Link chuyển sang đăng nhập */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="font-semibold text-indigo-600 hover:underline"
            >
              Đăng nhập
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
