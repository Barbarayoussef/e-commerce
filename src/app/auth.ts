import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  email: string;
  iat: number;
  id: string;
  name: string;
  role: string;
}
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Invalid credentials");
        }

        const data = await res.json();

        if (!data.accessToken) {
          throw new Error("Invalid credentials");
        }

        const decodedToken: DecodedToken = jwtDecode(data.accessToken);

        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: decodedToken,
          id: decodedToken.id,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
