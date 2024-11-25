import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate-limit";

export async function POST(req) {
  try {
    if (!rateLimiter(req)) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Note: Storing password as plain text for learning purposes only
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "An error occurred during registration"
            : error.message,
      },
      { status: 500 }
    );
  }
}
