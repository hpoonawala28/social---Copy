"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const fetchUserPosts = async () => {
    setPostsLoading(true);
    if (session) {
      try {
        const res = await fetch(`/api/user/${session.user.id}/posts`);
        if (!res.ok) {
          throw new Error("Failed to fetch user posts.");
        }
        const data = await res.json();
        setUserPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setPostsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserPosts();
    }
  }, [session, status]);

  if (status === "loading" || postsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="flex items-center justify-center min-h-screen">Please sign in to view your profile.</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">
        {session.user.name}'s Profile
      </h1>

      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <Card key={post._id} className="mb-4">
              <CardContent className="pt-6">
                <p>{post.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">You haven't made any posts yet.</p>
        )}
      </div>
    </div>
  );
}