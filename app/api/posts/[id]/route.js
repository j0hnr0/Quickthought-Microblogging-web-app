import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { rateLimiter } from "@/lib/rate-limit";

// Get single post
export async function GET(req, { params }) {
  try {
    if (!rateLimiter(req)) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}

// PUT update post
export async function PUT(req, { params }) {
  try {
    if (!rateLimiter(req)) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    // Validate content
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Get the post
    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is the author of the post
    if (post.authorId !== user.id) {
      return NextResponse.json(
        { error: "You are not the author of this post" },
        { status: 403 }
      );
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "An error occurred while updating the post"
            : error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(req, { params }) {
  try {
    if (!rateLimiter(req)) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is the author of the post
    if (post.authorId !== user.id) {
      return NextResponse.json(
        { error: "You are not the author of this post" },
        { status: 403 }
      );
    }

    // Delete post
    await prisma.post.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "An error occurred while deleting the post"
            : error.message,
      },
      { status: 500 }
    );
  }
}
