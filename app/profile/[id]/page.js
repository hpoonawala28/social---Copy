"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React from 'react'; // New import

export default function OtherProfilePage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
const userId = id;
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        // Fetch user data
        const userRes = await fetch(`/api/user/${userId}`);
        const userData = await userRes.json();

        // Fetch user's posts
        const postsRes = await fetch(`/api/user/${userId}/posts`);
        const postsData = await postsRes.json();

        if (userRes.ok && postsRes.ok) {
          setUser(userData);
          setUserPosts(postsData);
        } else {
          // Handle case where user is not found
          router.push('/404');
        }
      } catch (err) {
        console.error(err);
        // Handle API errors
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">User not found.</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">
        {user.name}'s Profile
      </h1>

      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
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
          <p className="text-center text-gray-500">This user hasn't made any posts yet.</p>
        )}
      </div>
    </div>
  );
}
