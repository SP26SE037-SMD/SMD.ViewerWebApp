import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    // 1. Buộc đăng xuất ví dụ như khi token hết hạn
    const res = await request.json();
    const force = res?.force as boolean | undefined;
    if (force) {
        return Response.json(
            { message: "Buộc đăng xuất" },
            {
                status: 200,
                headers: {
                    // Xóa cookie sessionToken khi đăng xuất
                    "Set-Cookie": "sessionToken=; Path=/; HttpOnly; Max-Age=0",
                },
            }
        );
    }

    // 2. Nếu là logout chủ động, lấy token từ cookie để gọi Backend
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken");

    if (!sessionToken) {
        return Response.json(
            { message: "Không nhận được session token" },
            { status: 401 }
        );
    }

    try {
        // Gọi Backend để hủy token (Server-to-Server)
        const result = await authApiRequest.logoutFromNextServerToServer(
            sessionToken.value
        );
        return Response.json(
            { message: "Đăng xuất thành công" },
            {
                status: 200,
                headers: {
                    // Xóa cookie sessionToken khi đăng xuất
                    "Set-Cookie": "sessionToken=; Path=/; HttpOnly; Max-Age=0",
                },
            });
    } catch (err) {
        if (err instanceof HttpError) {
            return Response.json(err.payload, { status: err.status });
        }
        return Response.json(
            { message: "Đã có lỗi xảy ra trong quá trình đăng xuất" },
            { status: 500 }
        );
    }
}
