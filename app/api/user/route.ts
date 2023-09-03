import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

// Define a schema for input validation

const userSchema = z.object({
    username: z.string().min(2, "Nom d'utilisateur requis").max(30),
    email: z.string().min(1, "Entrez votre email").email("Email incorrect"),
    password: z.
        string()
        .min(1, "Entrez votre mot de passe")
        .min(8, "Le mot de passe doit avoir 8 caractères minimum"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        // Check if email already exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });

        if (existingUserByEmail) {
            return NextResponse.json({ user: null, message: "Un utilisateur utilise déjà cet email" }, { status: 409 })
        }

        // Check if username already exists
        const existingUserByUsername = await db.user.findUnique({
            where: { username: username }
        });

        if (existingUserByUsername) {
            return NextResponse.json({ user: null, message: "Ce nom d'utilisateur est déjà pris" }, { status: 409 })
        }

        const hashedPassword = await hash(password, 12);
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        const { password: newUserPassword, ...rest } = newUser;


        return NextResponse.json({ user: rest, message: "Utilisateur créé !" }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 });
    }
}