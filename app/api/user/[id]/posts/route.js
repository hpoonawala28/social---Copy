import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    await dbConnect();
    const userId = id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}