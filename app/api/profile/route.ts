import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod";

const profileSchema = z.object({
    username: z.string().min(1, "Veuillez entrer un nom d'utilisateur"),
    email: z.string(),
    password: z.string(),
    gender: z.string(),
    country: z.string().min(1, "Veuillez choisir votre pays"),
    region: z.string().min(1, "Veuillez choisir une région"),
    dob: z.string(),
    relation: z.string(),
    bio: z.string().max(500),
    image: z.string()

});

export async function PUT(req: Request) {

    const session = await getServerSession(authOptions);

    try {
        const body = await req.json();
        const {
            username,
            email,
            password,
            gender,
            country,
            region,
            dob,
            relation,
            bio,
            image } = profileSchema.parse(body);

        /*         // Check if username already exists
                const existingUserByUsername = await db.user.findUnique({
                    where: { username: username }
                });
        
                if (existingUserByUsername) {
                    return NextResponse.json({ user: null, message: "Ce nom d'utilisateur est déjà pris" }, { status: 409 })
                } */

        const hashedPassword = await hash(password, 12);

        const upsertUser = await db.user.update({
            where: {
                email: email
            },
            data: {
                username,
                password: hashedPassword,
                email,
                gender,
                country,
                region,
                dob,
                relation,
                bio,
                image
            },
        })

        return NextResponse.json({ upsertUser, message: "Utilisateur modifié !" }, { status: 201 });

    } catch (error) {
        console.log("[ROUTE_PUT]", error);
        return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 });
    }

}
