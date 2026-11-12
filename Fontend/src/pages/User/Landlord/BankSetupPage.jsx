import React from "react";
import BankConfigForm from "../../../Component/bankConfigForm";

export default function BankSetupPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user)
    return (
      <p className="text-center mt-10 text-gray-600">Vui lòng đăng nhập.</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        💳 Cấu hình tài khoản ngân hàng
      </h1>
      <BankConfigForm landlordId={user.id} />
    </div>
  );
}
