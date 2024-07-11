import { Prisma } from "@prisma/client";
import { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "~/prisma";
import { generateUsername } from "./libs/tools";

export const NextAuthConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID as string,
      clientSecret: process.env.AUTH_DISCORD_SECRET as string,
    })
  ],
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn(props) {
      try {
        const provider = props.account?.provider;
        const data: Prisma.UserCreateInput = {
          name: props.user.name!,
          username: generateUsername(props.user.name!),
          email: props.user.email!,
          picture: props.user.image!,
          bio: provider == 'github' ? (props.profile as any)?.bio : '',
        }

        const upsert = await prisma.user.upsert({
          where: { email: data.email },
          create: data,
          update: {},
        })
        return true;
      } catch (error) {
        console.log("🚀 ~ signIn ~ error:", error)
        return false;
      }
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}`;
    },
    async session({ token }: any) {
      return { ...token };
    },
    async jwt(props) {
      try {
        if (props.account) {
          props.token.accessToken = props.account.access_token;
        }
        const find = await prisma.user.findFirst({
          where: { email: props.token.email! },
          select: {
            id: true,
            name: true,
            username: true,
            picture: true,
            bio: true,
            lang: true,
            role: true,
            visibility: true,
            is_verified: true,
            is_blocked: true,
          }
        });

        if (!find) return {};
        return { ...props.token, ...find };
      } catch (e) {
        console.log(e);
        return {};
      }
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.SESSION_NAME!,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 1 * 60 * 60 * 24 * 30, // satu bulan
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
