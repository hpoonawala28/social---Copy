"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) {
        throw new Error("Failed to fetch posts.");
      }
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!content.trim()) {
      setError("Post content cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create post.");
      }

      setContent('');
      alert("Post created successfully!");
      fetchPosts();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || postsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      {session && (
        <nav className="w-full max-w-2xl flex justify-end gap-4 mb-4">
          <Link href="/profile" className="text-blue-600 hover:underline">
            Profile
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-red-600 hover:underline">
            Sign out
          </button>
        </nav>
      )}
      <h1 className="text-3xl font-bold mb-8">Social Media Feed</h1>
      {session ? (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create a new post</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handlePost}>
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-24 mb-4"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </form>
        </div>
      ) : (
        <p className="text-center text-lg mt-8">
          Please <a href="/signin" className="text-blue-600 font-semibold">sign in</a> to create a post.
        </p>
      )}

      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post._id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <Link href={`/profile/${post.user._id}`} className="text-lg hover:underline">
                    {post.user.name}
                  </Link>
                  <div className="text-sm font-normal text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
}