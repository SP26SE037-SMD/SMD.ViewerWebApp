import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_ENDPOINT || "";

const MOCK_CURRICULUMS = [
  { curriculumId: "1", curriculumCode: "CTDT-CNTT-2020", curriculumName: "Chương Trình Đào Tạo Công Nghệ Thông Tin 2020", startYear: 2020, status: "ACTIVE" },
  { curriculumId: "2", curriculumCode: "CTDT-CNTT-2022", curriculumName: "Chương Trình Đào Tạo Công Nghệ Thông Tin 2022", startYear: 2022, status: "ACTIVE" },
  { curriculumId: "3", curriculumCode: "CTDT-HTTT-2020", curriculumName: "Chương Trình Đào Tạo Hệ Thống Thông Tin 2020", startYear: 2020, status: "ACTIVE" },
  { curriculumId: "4", curriculumCode: "CTDT-HTTT-2022", curriculumName: "Chương Trình Đào Tạo Hệ Thống Thông Tin 2022", startYear: 2022, status: "ACTIVE" },
  { curriculumId: "5", curriculumCode: "CTDT-KHMT-2021", curriculumName: "Chương Trình Đào Tạo Khoa Học Máy Tính 2021", startYear: 2021, status: "ACTIVE" },
  { curriculumId: "6", curriculumCode: "CTDT-KT-2020", curriculumName: "Chương Trình Đào Tạo Kỹ Thuật Phần Mềm 2020", startYear: 2020, status: "ACTIVE" },
  { curriculumId: "7", curriculumCode: "CTDT-KT-2023", curriculumName: "Chương Trình Đào Tạo Kỹ Thuật Phần Mềm 2023", startYear: 2023, status: "ACTIVE" },
  { curriculumId: "8", curriculumCode: "CTDT-ATTT-2022", curriculumName: "Chương Trình Đào Tạo An Toàn Thông Tin 2022", startYear: 2022, status: "ACTIVE" },
  { curriculumId: "9", curriculumCode: "CTDT-DTVT-2021", curriculumName: "Chương Trình Đào Tạo Điện Tử Viễn Thông 2021", startYear: 2021, status: "ACTIVE" },
];

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").toLowerCase();
  const name = (searchParams.get("name") || "").toLowerCase();
  const code = (searchParams.get("code") || "").toLowerCase();
  const page = Number(searchParams.get("page") || "0");
  const size = Number(searchParams.get("size") || "12");

  // Try real backend first
  try {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (name) params.set("name", name);
    if (code) params.set("code", code);
    params.set("page", String(page));
    params.set("size", String(size));
    params.set("status", "ACTIVE");

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`;

    const res = await fetch(`${BACKEND_URL}/curriculums?${params.toString()}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      return Response.json(data, { status: 200 });
    }
  } catch {
    // Backend unavailable — fall through to mock data
  }

  // Filter mock data by search query
  const filtered = (search || name || code)
    ? MOCK_CURRICULUMS.filter((c) => {
        const matchesSearch = search && (c.curriculumName.toLowerCase().includes(search) || c.curriculumCode.toLowerCase().includes(search));
        const matchesName = name && c.curriculumName.toLowerCase().includes(name);
        const matchesCode = code && c.curriculumCode.toLowerCase().includes(code);
        return matchesSearch || matchesName || matchesCode;
      })
    : MOCK_CURRICULUMS;

  const start = page * size;
  const content = filtered.slice(start, start + size);

  return Response.json({
    status: 200,
    message: "OK (mock data)",
    data: {
      content,
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
    },
  });
}
