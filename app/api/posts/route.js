import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
     console.log("Session in API route:", session); // New line

    if (!session) {
      return NextResponse.json({ message: "You must be logged in to create a post." }, { status: 401 });
    }

    await dbConnect();

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ message: "Post content cannot be empty." }, { status: 400 });
    }

    const newPost = await Post.create({
      content,
      user: session.user.id,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
export async function GET() {
  try {
    await dbConnect();

    // Find all posts, populate the 'user' field with user data, and sort by creation date
    const posts = await Post.find({})
      .populate({
        path: 'user',
        select: 'name username image', // Select which user fields to return
        model: User,
      })
      .sort({ createdAt: -1 }) // Sort in reverse chronological order
      .exec();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}