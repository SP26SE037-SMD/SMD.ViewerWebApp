# TRƯỜNG HỢP CẦN XỬ LÝ ROUTE HANDLERS
1. Làm "Proxy" để bảo mật API Key (Bắt buộc)
Nếu bạn cần gọi một API bên thứ ba (như OpenAI, Stripe, hay một Service trả phí) yêu cầu Secret Key.

Sai: Gọi trực tiếp từ Client (Lộ Key ngay lập tức).

Đúng: Client gọi lên Route Handler của bạn (/api/chat) -> Route Handler dùng Secret Key gọi OpenAI -> Trả kết quả về cho Client.
2. Cung cấp API cho bên thứ ba (Webhook & External Integration)
Nếu dự án của bạn cần nhận dữ liệu từ nơi khác đổ về:

Webhooks: Khi có đơn hàng từ Stripe, hoặc GitHub gửi thông báo code vừa push.

Public API: Khi bạn muốn cho phép ứng dụng khác (Mobile app, partner) truy vấn dữ liệu từ database của bạn.
3. Xử lý logic nặng hoặc các định dạng file đặc biệt
Khi bạn cần trả về dữ liệu không phải là HTML hay JSON thông thường:

Tạo File: Export file PDF, Excel, hoặc tạo mã QR code.

Streaming: Stream dữ liệu từ AI (như ChatGPT) trả về từng chữ một cho UI.

Image Optimization: Xử lý ảnh on-the-fly.
4. Route Handlers vs Server Actions
Đây là điểm dễ nhầm lẫn nhất.

Server Actions: Dùng cho các hành động phát sinh từ Form hoặc sự kiện của người dùng (onClick) trong cùng một ứng dụng. Nó tiện hơn vì không cần định nghĩa URL.

Route Handlers: Dùng khi bạn cần một Standard REST Endpoint (có URL cụ thể như GET /api/products) mà bất kỳ công cụ nào (Postman, CURL, hay Mobile App) cũng có thể gọi được.