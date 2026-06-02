import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return Response.json(
      { message: "email và password là bắt buộc" },
      { status: 400 },
    );
  }

  const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "*/*" },
    body: JSON.stringify({ email, password }),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return Response.json(data, { status: backendRes.status });
  }

  const sessionToken = data?.data?.token as string | undefined;

  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được token từ backend" },
      { status: 500 },
    );
  }

  const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();

  return Response.json(data, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}`,
    },
  });
}