import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/market/", {
      method: "POST",
      headers: {
        Cookie: `token=${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    return Response.json(
      { message: "Failed to create event" },
      { status: 500 }
    );
  }
}
