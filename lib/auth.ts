import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcrypt";


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

                const passwordMatch = await compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                    throw new Error("Invalid password");
                }
                return {
                    id: `${existingUser.id}`,
                    email: existingUser.email,
                    username: existingUser.username,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            /*             console.log("jwtlog", token, user); */
            if (user) {
                return {
                    ...token,
                    username: user.username
                }
            }
            return token
        },
        async session({ session, token }) {
            /*             console.log("sessionlog", session, token); */
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username
                }
            }
        },
    }

}
