# KNOWLEDGE - Kiến thức Nextjs
> **không cần đọc** file này dùng để tôi ghi chú kiến thức cho dự án
## 1. Kiến trúc hệ thống:
[Browser/Client]
      ↓
Middleware (check xem Cookie chứa token có tồn tại không. Nếu không, nó sẽ redirect user về /login.)
      ↓
Client Component (ví dụ: app/login/page.tsx và app/login/login.tsx dùng "use client")
      ↓
schemaValidations (Validate dữ liệu)
      ↓
apiRequests/*.ts (xử lí get post put delete)
      ↓
lib/http.ts  (một wrapper của fetch API được custom sẵn để đính kèm header, xử lý lỗi chung)
      ↓
Route Handler (ví dụ: app/api/auth/route.ts, thường dùng cho auth, để lưu và xử lí token)
      ↓
Backend Server

## 2. Sự khác biệt giữa Implicit Flow và Authorization Code Flow (Login Google)
### Implicit Flow (Luồng ẩn)
Trong file app/login/login.tsx, bạn đang truyền tham số response_type: "id_token". Đây là đặc trưng của Implicit Flow.
Luồng hoạt động của bạn hiện tải:
1. Trình duyệt chuyển hướng user sang trang login Google.
2. User đăng nhập xong, Google chuyển hướng về trang của bạn và gắn trực tiếp Token lên URL dưới dạng hash (ví dụ: http://localhost:3000/login#id_token=eyJhb...).
3. Component login.tsx (Client-side) đọc cái id_token từ URL đó.
4. Client gửi cái id_token này xuống cho Next.js Backend (app/api/auth/login-google/route.ts).
5. Backend gửi sang Backend Server của bạn để xác thực và trả về Token của hệ thống.
* Nhược điểm: Cái id_token nằm chình ình trên URL. Bất kỳ tiện ích mở rộng (extension) nào trên trình duyệt đọc được lịch sử trình duyệt, hoặc mã độc XSS đều có thể đánh cắp cái token này trước khi bạn kịp dùng lệnh window.history.replaceState để xóa nó đi.
### Authorization Code Flow (Luồng an toàn hơn)
Trong luồng này, bạn sẽ đổi response_type thành "code".
Luồng hoạt động sẽ như sau:
1. Trình duyệt chuyển hướng user sang trang login Google với tham số response_type=code.
2. User đăng nhập xong, Google chuyển hướng về trang của bạn và chỉ gắn một mã ngắn hạn (Authorization Code) trên URL (ví dụ: http://localhost:3000/login?code=4/0AbUR2...). (Cái mã này hoàn toàn vô dụng nếu kẻ gian ăn cắp được).
3. Component login.tsx đọc cái code này và gửi xuống Next.js Backend.
4. (Khác biệt lõi nằm ở bước này): Next.js Backend sẽ lấy cái code đó, kết hợp với một cái Client Secret (chỉ lưu trên server, tuyệt đối không lộ xuống Client) để gọi một request bí mật (Server-to-Server) sang Google.
5. Google thấy đúng code và đúng Client Secret thì mới trả về Token cho Server. Server cầm token đó đi xác thực với Backend chính.
👉 Ưu điểm cực lớn: Token thực sự (id_token, access_token) không bao giờ đi qua hoặc hiển thị ở phía Trình duyệt (Client). Nó chỉ chạy ngầm từ Server của Google sang Server của Next.js. Do đó, miễn nhiễm hoàn toàn với việc bị trộm token qua lịch sử trình duyệt hay XSS.