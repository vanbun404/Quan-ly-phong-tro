export default function Settings() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div>
          <label className="block font-medium">Tên hệ thống</label>
          <input
            type="text"
            className="border w-full p-2 rounded-lg"
            defaultValue="Hệ thống quản lý phòng trọ"
          />
        </div>

        <div>
          <label className="block font-medium">Email liên hệ</label>
          <input
            type="email"
            className="border w-full p-2 rounded-lg"
            defaultValue="admin@rental.vn"
          />
        </div>

        <div>
          <label className="block font-medium">Chế độ</label>
          <select className="border w-full p-2 rounded-lg">
            <option>Chế độ sáng</option>
            <option>Chế độ tối</option>
          </select>
        </div>

        <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600">
          💾 Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
