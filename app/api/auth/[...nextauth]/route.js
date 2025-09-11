import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
async authorize(credentials) {
        await dbConnect();
        
        console.log("Credentials provided:", credentials); // New line

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          console.log("User not found."); // New line
          return null;
        }

        console.log("User found:", user); // New line

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        console.log("Password match result:", isMatch); // New line
        
        if (isMatch) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }
        
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();
      if (account.provider === "google") {
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              username: user.email.split('@')[0],
              password: "google_auth_password_placeholder", // Placeholder password for Google users
            });
            user.id = newUser._id.toString();
          } else {
            user.id = existingUser._id.toString();
          }
        } catch (error) {
          console.error("Error signing in user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/signin', // A custom sign-in page we will create later
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };