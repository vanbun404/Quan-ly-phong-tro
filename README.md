# Ứng dụng phân tán quản lý phòng trọ

Ứng dụng web hỗ trợ người thuê tìm phòng, chủ trọ đăng và quản lý phòng, ký hợp đồng, thanh toán và gửi yêu cầu hỗ trợ. Hệ thống được tổ chức theo kiến trúc microservice, với frontend React/Vite và các backend service độc lập chạy bằng Node.js/Express.

## Tính năng chính

- Đăng ký, đăng nhập và phân quyền người thuê, chủ trọ, quản trị viên.
- Tìm kiếm, xem chi tiết và lọc danh sách phòng trọ.
- Chủ trọ đăng phòng, tải ảnh lên Cloudinary và quản lý thông tin phòng.
- Quản lý hợp đồng và hỗ trợ ký/xuất tài liệu.
- Tạo và theo dõi giao dịch thanh toán qua PayOS/VNPay.
- Quản lý cấu hình ngân hàng của chủ trọ.
- Thông báo, ticket hỗ trợ và báo cáo sự cố.
- Trang quản trị cho người dùng, phòng, hợp đồng, giao dịch, tòa nhà và thông báo.

## Kiến trúc

```text
Fontend (React + Vite)
        |
        +--> User-service             :3000
        +--> Room-service             :8000
        +--> Payment-service          :4000
        +--> Support-Report-service   :5000
        +--> Notification-service     :6000

Các service sử dụng PostgreSQL/Prisma và giao tiếp qua REST API.
```

### Các thành phần

| Thành phần | Công nghệ | Cổng mặc định | Trách nhiệm |
|---|---|---:|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router | 5173 | Giao diện người dùng và quản trị |
| User-service | Node.js, Express, Prisma, JWT | 3000 | Xác thực, người dùng, chủ trọ, admin, chữ ký |
| Room-service | Node.js, Express, Prisma, Cloudinary | 8000 | Phòng, hình ảnh và hợp đồng |
| Payment-service | Node.js, Express, PayOS, VNPay | 4000 | Thanh toán và cấu hình ngân hàng |
| Notification-service | Node.js, Express, Prisma | 6000 | Thông báo |
| Support-Report-service | Node.js, Express, Prisma | 5000 | Ticket hỗ trợ và báo cáo |
| Cơ sở dữ liệu | PostgreSQL | — | Lưu trữ dữ liệu cho các service |

## Yêu cầu môi trường

- Node.js 18 trở lên
- npm
- Docker Desktop và Docker Compose (khuyến nghị)
- PostgreSQL nếu chạy database ngoài Docker
- Tài khoản Cloudinary nếu cần tải ảnh
- Tài khoản PayOS/VNPay nếu cần kiểm thử thanh toán

## Cấu hình biến môi trường

Tạo file `.env` trong từng service tương ứng. Không commit các file này lên GitHub.

Các biến thường dùng:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/database_name
```

`User-service` và `Room-service` cần thêm:

```env
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
```

`Payment-service` cần thêm thông tin PayOS và URL callback:

```env
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key
PAYOS_CHECKSUM_KEY=your_checksum_key
BASE_URL=http://localhost:4000
PAYOS_RETURN_URL=http://localhost:5173/payment/success
PAYOS_CANCEL_URL=http://localhost:5173/payment/cancel
PAYOS_WEBHOOK_URL=https://your-public-url/webhook
```

Tên biến và giá trị thực tế có thể thay đổi theo file cấu hình của từng môi trường.

## Cài đặt và chạy

### Cách 1: Chạy bằng Docker Compose

1. Tạo/cập nhật các file `.env` theo từng service.
2. Từ thư mục `Backend`, chạy:

   ```bash
   docker compose up --build
   ```

3. Trong cửa sổ terminal khác, cài dependency và chạy frontend:

   ```bash
   cd Fontend
   npm install
   npm run dev
   ```

4. Mở địa chỉ Vite hiển thị trên terminal, thường là `http://localhost:5173`.

### Cách 2: Chạy từng service bằng Node.js

Trong mỗi thư mục service:

```bash
npm install
npm start
```

Các service và cổng tương ứng:

```text
Backend/User-service              -> http://localhost:3000
Backend/Room-service              -> http://localhost:8000
Backend/Payment-service           -> http://localhost:4000
Backend/Support-Report-service    -> http://localhost:5000
Backend/Notification-service      -> http://localhost:6000
```

Frontend:

```bash
cd Fontend
npm install
npm run dev
```

## Prisma và cơ sở dữ liệu

Mỗi service có schema Prisma riêng. Sau khi cấu hình `DATABASE_URL`, chạy lệnh Prisma trong thư mục service cần sử dụng:

```bash
npx prisma generate
npx prisma migrate dev
```

Nếu dự án đã có migration/seed tương ứng, có thể chạy thêm:

```bash
npx prisma db seed
```

Không đưa thư mục dữ liệu PostgreSQL cục bộ (`Backend/databases`) lên repository.

## Lệnh frontend

```bash
npm run dev       # Chạy môi trường phát triển
npm run build     # Build bản production
npm run preview   # Xem thử bản build
npm run lint      # Kiểm tra ESLint
```

## Cấu trúc thư mục

```text
.
├── Backend/
│   ├── User-service/
│   ├── Room-service/
│   ├── Payment-service/
│   ├── Notification-service/
│   ├── Support-Report-service/
│   ├── databases/              # Dữ liệu PostgreSQL cục bộ, không commit
│   └── docker-compose.yml
└── Fontend/                    # React/Vite frontend
```

## Lưu ý bảo mật

- Không commit `.env`, API key, secret, JWT secret hoặc thông tin thanh toán.
- Khi triển khai thật, thay toàn bộ URL `localhost` bằng domain/service URL tương ứng.
- Cấu hình CORS, HTTPS, webhook và quyền truy cập database theo môi trường triển khai.

## Trạng thái dự án

Đây là dự án học tập/đồ án ứng dụng phân tán. Một số service phụ thuộc vào cấu hình database, Cloudinary và cổng thanh toán bên ngoài để chạy đầy đủ.
