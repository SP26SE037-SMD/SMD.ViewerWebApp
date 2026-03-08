import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
        return Response.json({ message: "idToken is required" }, { status: 400 });
    }

    // Gọi Backend Server → Server-to-Server (không bị CORS)
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/login-google`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify({ idToken }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
        return Response.json(data, { status: backendRes.status });
    }

    // Lấy token từ response của backend (data.data.token)
    const sessionToken = data?.data?.token as string | undefined;

    if (!sessionToken) {
        return Response.json(
            { message: "Không nhận được token từ backend" },
            { status: 500 }
        );
    }

    // Tính thời gian hết hạn (1 giờ từ bây giờ, hoặc parse từ JWT nếu cần)
    const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();

    return Response.json(data, {
        status: 200,
        headers: {
            "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}`,
        },
    });
}
