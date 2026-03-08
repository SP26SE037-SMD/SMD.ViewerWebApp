import { jwtDecode } from "jwt-decode";

export async function POST(request: Request) {
  const body = await request.json();
  const sessionToken = body.token as string;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      { status: 400 }
    );
  }
  // Giải mã token để lấy trường 'exp'
  const decoded = jwtDecode<{ exp: number }>(sessionToken);
  // JWT exp tính bằng giây, JS Date tính bằng miligiây
  const expirationDate = new Date(decoded.exp * 1000).toUTCString();

  return Response.json(body, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Expires=${expirationDate}; Secure`,
    },
  });
}
