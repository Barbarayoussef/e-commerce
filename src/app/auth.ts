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
        const res = await fetch(`${process.env.baseUrl}/auth/signIn`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        const data = await res.json();
        let decodedToken: DecodedToken = jwtDecode(data.token);
        if (data.message == "success") {
          //   return data;
          return {
            token: data.token,
            user: decodedToken,
            id: decodedToken.id,
          };
        } else {
          throw new Error("invalid");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = (user as any).token;
        token.user = (user as any).user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = (token as any).user;
      }
      return session;
    },
  },
};
