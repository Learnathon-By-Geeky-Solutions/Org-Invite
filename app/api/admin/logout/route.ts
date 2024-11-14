import { NextResponse } from "next/server";

export async function POST() {
	try {
		const response = NextResponse.json({ success: true });

		// Remove admin session cookie with proper configuration
		response.cookies.delete({
			name: "admin_session",
			path: "/",
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
