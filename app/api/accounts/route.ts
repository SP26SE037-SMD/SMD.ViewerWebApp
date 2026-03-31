import { cookies } from "next/headers";
import envConfig from "@/config";

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const id = searchParams.get("id");
  const status = searchParams.get("status") || "true";

  if (!id) {
    return Response.json(
      { message: "Missing account ID" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  try {
    const res = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/api/accounts?id=${encodeURIComponent(id)}&status=${status}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
