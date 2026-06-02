import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

type AuthBackendResponse = {
    data?: {
        token?: string;
        sessionToken?: string;
    };
    token?: string;
    sessionToken?: string;
    message?: string;
};

export async function POST(req: NextRequest) {
    if (!BACKEND_URL) {
        return Response.json(
            { message: "NEXT_PUBLIC_API_ENDPOINT is not configured" },
            { status: 500 }
        );
    }

    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
        return Response.json({ message: "idToken is required" }, { status: 400 });
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/auth/login-google`, {
            method: "POST",
            headers: { "Content-Type": "application/json", accept: "*/*" },
            body: JSON.stringify({ idToken }),
        });

        const responseText = await backendRes.text();
        let data: AuthBackendResponse | string | null = null;

        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch {
                data = responseText;
            }
        }

        if (!backendRes.ok) {
            return Response.json(
                typeof data === "string" ? { message: data } : data,
                { status: backendRes.status }
            );
        }

        const responseData = typeof data === "string" ? null : data;
        const sessionToken =
            responseData?.data?.token ??
            responseData?.data?.sessionToken ??
            responseData?.sessionToken ??
            responseData?.token;

        if (!sessionToken) {
            return Response.json(
                { message: "Không nhận được token từ backend", raw: data },
                { status: 500 }
            );
        }

        const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();

        return Response.json(data, {
            status: 200,
            headers: {
                "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}`,
            },
        });
    } catch (error) {
        console.error("Google login proxy failed", error);
        return Response.json(
            { message: "Không thể kết nối tới backend đăng nhập Google" },
            { status: 502 }
        );
    }
}
