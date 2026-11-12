import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/imgs/background.jpg";
import { LoginUser } from "../api/authApi";

export default function LoginForm({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ dùng để chuyển trang

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await LoginUser({
      email: form.email,
      password: form.password,
    });
    console.log(res);
    if (res.user) {
      const { role } = res.user;
      localStorage.setItem("user", JSON.stringify(res.user)); // lưu thông tin user
      setMessage("✅ Đăng nhập thành công!");

      // ✅ Điều hướng theo vai trò
      if (role === "USER") navigate("/user");
      else if (role === "LANDLORD") navigate("/landlord");
      else if (role === "ADMIN") navigate("/admin");
      else navigate("/");
    } else {
      setMessage(res.message || "❌ Sai thông tin đăng nhập");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Đăng nhập
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Chào mừng bạn quay lại 👋
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
          >
            Đăng nhập
          </button>

          {message && (
            <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
          )}

          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="font-semibold text-indigo-600 hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
