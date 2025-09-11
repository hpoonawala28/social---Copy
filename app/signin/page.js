"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // We will install this soon
import { Input } from "@/components/ui/input"; // We will install this soon

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/",
    });
    setLoading(false);
    if (result.error) {
      console.error("Google Sign-in failed:", result.error);
    } else {
      router.push("/");
    }
  };

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    setLoading(false);
    if (result.error) {
      console.error("Credentials Sign-in failed:", result.error);
      alert("Sign-in failed. Please check your email and password.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <div className="space-y-4 mb-6">
          <Button onClick={handleGoogleSignIn} className="w-full">
            Sign in with Google
          </Button>
        </div>

        <div className="relative flex justify-center text-xs uppercase mb-6">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>

        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}