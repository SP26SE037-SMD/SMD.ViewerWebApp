# Tài Liệu Giao Tiếp API Giữa Các Trang (API Flow Documentation)

Tài liệu này mô tả chi tiết thứ tự gọi API, các tham số (`request`) gửi đi và cấu trúc dữ liệu (`response`) nhận về cho từng trang và component chính trong hệ thống **SMD (Syllabus Management and Digitalization System)**.

---

## 1. Thành phần chung (Header & Notifications)
Các API này được gọi xuyên suốt ở layout chính (hiển thị trên mọi trang có Header).

### a. Lấy thông tin người dùng đang đăng nhập (`HeaderClient`)
*   **Thứ tự:** Được gọi ngay khi render trang (lấy token từ cookie).
*   **API:** `GET /api/accounts/me` (thông qua `accountApiRequest.me`)
*   **Request:** Gửi Header `Authorization: Bearer <sessionToken>`
*   **Response:**
    ```json
    {
      "status": 200,
      "message": "Success",
      "data": {
        "accountId": "string",
        "email": "string",
        "fullName": "string",
        "avatarUrl": "string",
        "role": { "roleName": "ADMIN" | "GUEST" }
      }
    }
    ```

### b. Lấy thông báo (`Notification Popover / Modal`)
*   **Thứ tự:** Gọi khi component render để kiểm tra số lượng chưa đọc, gọi lại khi mở Popover hoặc Modal.
*   **API:** `GET /api/notifications/my-notifications`
*   **Request (Query Params):** `?page=0&size=10` (hoặc size=3 cho Popover)
*   **Response:**
    ```json
    {
      "status": 200,
      "data": {
        "content": [
          {
            "notificationId": "string",
            "title": "string",
            "message": "string",
            "isRead": boolean,
            "createdAt": "ISO-8601 string"
          }
        ],
        "totalPages": number
      }
    }
    ```
*   *Lưu ý:* Khi click "Mark as Read", sẽ gọi `PUT /api/notifications/{id}/mark-as-read`.

---

## 2. Trang Đăng Nhập (`/login`)
Trang này quản lý xác thực qua mật khẩu hoặc Google.

### a. Đăng nhập truyền thống
*   **Thứ tự 1:** Gọi API login backend.
    *   **API:** `POST /api/auth/login`
    *   **Request Body:** `{ "email": "admin@example.com", "password": "..." }`
    *   **Response:** Trả về `sessionToken` và thông tin tài khoản.
*   **Thứ tự 2:** Lưu token vào Next.js Server (Cookie).
    *   **API:** `POST /api/auth` (Next.js route)
    *   **Request Body:** `{ "sessionToken": "jwt_token..." }`

### b. Đăng nhập bằng Google (Google OAuth / FedCM)
*   **Thứ tự 1:** Trả Google `idToken` cho Backend.
    *   **API:** `POST /api/auth/login-google`
    *   **Request Body:** `{ "idToken": "google_jwt_token" }`
    *   **Response:** Trả về `sessionToken`.
*   **Thứ tự 2:** Lưu token vào Cookie (như trên).
*   **Thứ tự 3:** Đồng bộ tài khoản (nếu cần cập nhật thông tin).
    *   **API:** `PUT /api/accounts/{accountId}`
    *   **Request Body:** `{ "fullName": "...", "avatarUrl": "..." }`

---

## 3. Quản Lý Khung Chương Trình (`/curriculum`)

### a. Trang Danh Sách (`/curriculum`)
*   **API:** `GET /api/curriculums`
*   **Request (Query Params):** `?page=0&size=10&search=...&status=DRAFT`
*   **Response:** `CurriculumRes` chứa mảng `content` (curriculumId, curriculumName, startYear, status, ...).

### b. Trang Chi Tiết Khung Chương Trình (`/curriculum/[id]`)
*   **Thứ tự 1 (Lấy thông tin chung):** `GET /api/curriculums/{id}`
*   **Thứ tự 2 (Theo từng Tab người dùng click):**
    *   **Tab PLOs:** `GET /api/curriculums/{id}/plos`
    *   **Tab Subjects (Môn học theo kỳ):** 
        1. Gọi `GET /api/curriculums/{id}/semester-mappings`. Trả về danh sách môn học theo từng học kỳ.
        2. *Loop (Nếu môn học nằm trong nhóm tự chọn/Combo):* Gọi `GET /api/curriculums/groups/{groupId}` để lấy chi tiết nhóm.

### c. Trang Đồ Thị Trực Quan (`/curriculum/[id]/graph`)
*   **Thứ tự:** Gọi đồng thời `getCurriculumById` và `getSemesterMappingsByCurriculumId` thông qua `Promise.all` để xây dựng cấu trúc node-edge cho React Flow.

---

## 4. Quản Lý Đề Cương Chi Tiết (`/syllabus`)

### a. Trang Danh Sách Đề Cương
*   *Lưu ý:* Luồng hiện tại thường tra cứu thông qua danh sách Môn Học trước.
*   **API:** `GET /api/subjects` (lấy danh sách môn học phân trang).

### b. Trang Chi Tiết Đề Cương (`/syllabus/[id]`)
Đây là trang có nhiều dữ liệu phức tạp nhất, được chia thành nhiều Tabs.
*   **Tab Compare (So sánh đề cương):**
    1.  `GET /api/syllabuses/subject/{subjectId}` (Lấy danh sách các phiên bản đề cương cũ).
    2.  `POST /api/syllabuses/compare` (Yêu cầu AI so sánh).
        *   **Request Body:** `{ "sourceSyllabusId": "id1", "targetSyllabusId": "id2" }`
        *   **Response:** Trả về khác biệt: `added_concepts`, `removed_concepts`, `risk_assessment`.
*   **Tab Chapter & Materials (Tài liệu):**
    *   `GET /api/syllabuses/{id}/materials` (Lấy danh sách tài liệu).
    *   Sau đó gọi API đọc block nội dung `GET /api/materials/{materialId}/blocks`.
*   **Tab Assessments (Kiểm tra đánh giá):**
    *   `GET /api/syllabuses/{id}/assessments`
*   **Tab CLOs (Chuẩn đầu ra môn học):**
    *   `GET /api/subjects/{subjectId}/clos`
    *   `GET /api/subjects/{subjectId}/clo-plo-mappings` (Map CLO với PLO).
*   **Tab Sessions (Kế hoạch giảng dạy / Buổi học):**
    1.  `GET /api/syllabuses/{id}/sessions` (Lấy danh sách buổi học).
    2.  Khi bấm vào 1 buổi học: Gọi `GET /api/syllabuses/sessions/{sessionId}/clo-session-mappings` và `GET /api/syllabuses/sessions/{sessionId}/material-block-details`.

### c. Trang Đọc Tài Liệu / Material Viewer (`/syllabus/[id]/chapter/[chapterId]`)
Đây là trang dùng để đọc chi tiết nội dung của một tài liệu (Material) theo dạng block.
*   **Thứ tự 1:** `GET /api/syllabuses/subject/{subjectId}/published` (Tìm đề cương đã xuất bản của môn học hiện tại).
*   **Thứ tự 2:** Gọi đồng thời (`Promise.all`) để lấy thông tin đề cương và danh sách tài liệu:
    *   `GET /api/syllabuses/{syllabusId}` (Lấy thông tin đề cương).
    *   `GET /api/syllabuses/{syllabusId}/materials` (Lấy danh sách tài liệu).
*   **Thứ tự 3:** Tìm ID tài liệu hiện hành (`chapterId`) trong danh sách trên, sau đó gọi vòng lặp (while) để lấy toàn bộ nội dung khối (blocks) của tài liệu đó:
    *   **API:** `GET /api/materials/{materialId}/blocks`
    *   **Request (Query Params):** `?page=1&size=50` (Tăng dần page cho đến khi hết `totalPages`).
    *   **Response:**
        ```json
        {
          "status": 200,
          "data": {
            "content": [
              {
                "blockId": "string",
                "idx": number,
                "blockStyle": "string",
                "blockType": "string",
                "contentText": "string"
              }
            ],
            "totalPages": number
          }
        }
        ```

---


### b. Pre-requisite (`/pre-requisite`)
Trang này dùng để truy xuất **xuôi** (học xong môn này thì mở khóa được những môn nào).
*   **Thứ tự 1:** `GET /api/subjects` (danh sách môn).
*   **Thứ tự 2 (Khi chọn 1 môn):** `GET /api/subjects/{subjectCode}/dependent-subjects`
*   **Response:** Trả về đồ thị các môn học phụ thuộc vào môn hiện tại.

---
*Tài liệu này được trích xuất dựa trên logic hiện hành trong các tệp `.tsx` thuộc thư mục `app/` và định nghĩa schema tại thư mục `schemaValidations/`.*
