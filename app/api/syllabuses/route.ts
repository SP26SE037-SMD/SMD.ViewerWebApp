// import { cookies } from "next/headers";
// import { NextRequest } from "next/server";

// const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_ENDPOINT || "";

// const MOCK_SYLLABUSES = [
//   { syllabusId: "13245", syllabusCode: "CEA201", syllabusName: "Computer Organization and Architecture", credits: 3, department: "Khoa CNTT", status: "ACTIVE", description: "This course in an introduction to computer architecture and organization. It will cover topics in both the physical design of the computer (organization) and the logical design..." },
//   { syllabusId: "1", syllabusCode: "MTH101", syllabusName: "Giải Tích 1", credits: 3, department: "Khoa Toán - Tin", status: "ACTIVE", description: "Giới thiệu các khái niệm cơ bản về giới hạn, đạo hàm và tích phân." },
//   { syllabusId: "2", syllabusCode: "MTH102", syllabusName: "Giải Tích 2", credits: 3, department: "Khoa Toán - Tin", status: "ACTIVE", description: "Tích phân bội, tích phân đường và tích phân mặt." },
//   { syllabusId: "3", syllabusCode: "MTH201", syllabusName: "Đại Số Tuyến Tính", credits: 3, department: "Khoa Toán - Tin", status: "ACTIVE", description: "Ma trận, hệ phương trình tuyến tính, không gian vectơ và ánh xạ tuyến tính." },
//   { syllabusId: "4", syllabusCode: "CSE101", syllabusName: "Nhập Môn Lập Trình", credits: 3, department: "Khoa CNTT", status: "ACTIVE", description: "Tư duy thuật toán, ngôn ngữ lập trình C, các cấu trúc điều khiển cơ bản." },
//   { syllabusId: "5", syllabusCode: "CSE102", syllabusName: "Lập Trình Hướng Đối Tượng", credits: 3, department: "Khoa CNTT", status: "ACTIVE", description: "Các khái niệm OOP: lớp, đối tượng, kế thừa, đa hình trong Java." },
//   { syllabusId: "6", syllabusCode: "CSE201", syllabusName: "Cấu Trúc Dữ Liệu và Giải Thuật", credits: 4, department: "Khoa CNTT", status: "ACTIVE", description: "Mảng, danh sách liên kết, ngăn xếp, hàng đợi, cây và đồ thị." },
//   { syllabusId: "7", syllabusCode: "CSE202", syllabusName: "Cơ Sở Dữ Liệu", credits: 3, department: "Khoa CNTT", status: "ACTIVE", description: "Mô hình quan hệ, SQL, thiết kế cơ sở dữ liệu và chuẩn hóa." },
//   { syllabusId: "8", syllabusCode: "CSE301", syllabusName: "Lập Trình Web", credits: 3, department: "Khoa CNTT", status: "ACTIVE", description: "HTML, CSS, JavaScript, ReactJS và các framework web hiện đại." },
//   { syllabusId: "9", syllabusCode: "CSE302", syllabusName: "Mạng Máy Tính", credits: 3, department: "Khoa CNTT", status: "ACTIVE", description: "Các giao thức mạng, mô hình OSI/TCP-IP, bảo mật mạng cơ bản." },
//   { syllabusId: "10", syllabusCode: "CSE401", syllabusName: "Trí Tuệ Nhân Tạo", credits: 4, department: "Khoa CNTT", status: "ACTIVE", description: "Thuật toán tìm kiếm, học máy, mạng nơ-ron và ứng dụng AI thực tế." },
//   { syllabusId: "11", syllabusCode: "ENG101", syllabusName: "Tiếng Anh Chuyên Ngành IT", credits: 2, department: "Khoa Ngoại Ngữ", status: "ACTIVE", description: "Từ vựng chuyên ngành, đọc hiểu tài liệu kỹ thuật bằng tiếng Anh." },
//   { syllabusId: "12", syllabusCode: "PHY101", syllabusName: "Vật Lý Đại Cương", credits: 3, department: "Khoa Khoa học", status: "ACTIVE", description: "Cơ học, nhiệt học, điện từ và quang học ở mức đại học." },
// ];

// export async function GET(request: NextRequest) {
//   const cookieStore = await cookies();
//   const sessionToken = cookieStore.get("sessionToken")?.value;

//   const { searchParams } = new URL(request.url);
//   const search = (searchParams.get("search") || "").toLowerCase();
//   const page = Number(searchParams.get("page") || "0");
//   const size = Number(searchParams.get("size") || "12");
//   const name = (searchParams.get("name") || "").toLowerCase();
//   const code = (searchParams.get("code") || "").toLowerCase();

//   // Try real backend first
//   try {
//     const params = new URLSearchParams();
//     if (search) params.set("search", search);
//     if (name) params.set("name", name);
//     if (code) params.set("code", code);
//     params.set("page", String(page));
//     params.set("size", String(size));
//     params.set("status", "ACTIVE");

//     const headers: Record<string, string> = { "Content-Type": "application/json" };
//     if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`;

//     const res = await fetch(`${BACKEND_URL}/syllabuses?${params.toString()}`, {
//       headers,
//       cache: "no-store",
//       signal: AbortSignal.timeout(5000),
//     });

//     if (res.ok) {
//       const data = await res.json();
//       return Response.json(data, { status: 200 });
//     }
//   } catch {
//     // Backend unavailable — fall through to mock data
//   }

//   // Filter mock data by search query
//   const filtered = (search || name || code)
//     ? MOCK_SYLLABUSES.filter((s) => {
//         const matchesSearch = search && (s.syllabusName.toLowerCase().includes(search) || s.syllabusCode.toLowerCase().includes(search) || s.department.toLowerCase().includes(search));
//         const matchesName = name && s.syllabusName.toLowerCase().includes(name);
//         const matchesCode = code && s.syllabusCode.toLowerCase().includes(code);
//         return matchesSearch || matchesName || matchesCode;
//       })
//     : MOCK_SYLLABUSES;

//   const start = page * size;
//   const content = filtered.slice(start, start + size);

//   return Response.json({
//     status: 200,
//     message: "OK (mock data)",
//     data: {
//       content,
//       page,
//       size,
//       totalElements: filtered.length,
//       totalPages: Math.ceil(filtered.length / size),
//     },
//   });
// }
