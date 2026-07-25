import { cookies } from "next/headers";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/market/${id}/reserve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Failed to reserve listing:", error);
    return Response.json({ message: "Failed to reserve listing" }, { status: 500 });
  }
}
