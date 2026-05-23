import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    token: string;
    user: {
      email: string;
      id: string;
      name: string;
      role: string;
    };
  }

  interface Session {
    user: {
      email: string;
      id: string;
      name: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    user: {
      email: string;
      id: string;
      name: string;
      role: string;
    };
  }
}
