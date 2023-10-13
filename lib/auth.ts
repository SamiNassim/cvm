import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcrypt";
import { Profile, User } from "@prisma/client";
import { createId } from '@paralleldrive/cuid2';

const cuid = createId();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: { scope: "openid email profile" }
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    username: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    onboarded: false,
                    profile: {
                        create: {
                            userId: profile.sub,
                            imageUrl: profile.picture,
                        }
                    },
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "john@mail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {

                    throw new Error("Invalid email or password");
                }
                const existingUser = await db.user.findUnique({
                    where: { email: credentials?.email }
                });
                if (!existingUser) {
                    throw new Error("User doesn't exist");
                }

                if (existingUser.password) {
                    const passwordMatch = await compare(credentials.password, existingUser.password);
                    if (!passwordMatch) {
                        throw new Error("Invalid password");
                    }
                }

                return {
                    id: `${existingUser.id}`,
                    email: existingUser.email,
                    username: existingUser.username,
                    onboarded: existingUser.onboarded,
                    isOnline: true,
                    profileId: existingUser.profileId,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            /* console.log("jwtlog", token, user); */
            if (user) {
                const u = user as unknown as User
                const p = user as unknown as Profile
                return {
                    ...token,
                    username: u.username,
                    id: u.id,
                    onboarded: u.onboarded,
                    imageUrl: p.imageUrl,
                    isOnline: u.isOnline,
                    profileId: u.profileId,
                }
            }
            return token
        },
        async session({ session, token }) {
            /* console.log("sessionlog", session, token); */
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    id: token.id,
                    onboarded: token.onboarded,
                    isOnline: token.isOnline,
                    profileId: token.profileId,
                }
            }
        },
    }

}
