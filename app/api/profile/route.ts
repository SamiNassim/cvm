import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod";

const profileSchema = z.object({
    gender: z.string(),
    country: z.string().min(1, "Veuillez choisir votre pays"),
    region: z.string().min(1, "Veuillez choisir une région"),
    dob: z.string(),
    relation: z.string(),
    bio: z.string().max(500),
    imageUrl: z.string()

});

export async function PUT(req: Request) {

    const session = await getServerSession(authOptions);

    try {
        const body = await req.json();
        const {
            gender,
            country,
            region,
            dob,
            relation,
            bio,
            imageUrl } = profileSchema.parse(body);

        /* const hashedPassword = await hash(password, 12); */

        /*         const existingProfile = await db.profile.findFirst({
                    where: {
                        userId: session?.user.id
                    }
                }) */

        /*        if (!existingProfile) {
                   const createProfile = await db.profile.create({
                       data: {
                           userId: session?.user.id!,
                           name: session?.user.username,
                           gender,
                           country,
                           region,
                           dob,
                           relation,
                           bio,
                           imageUrl
                       }
                   });
       
                   if (createProfile) {
                       const userOnboarded = await db.user.update({
                           where: {
                               id: session?.user.id,
                           },
                           data: {
                               onboarded: true,
                           }
                       });
       
                       return NextResponse.json({ user: userOnboarded, profile: createProfile, message: "Profile créé !" }, { status: 201 })
                   }
               } */

        const upsertUser = await db.profile.update({
            where: {
                id: session?.user.profileId,
            },
            data: {
                userId: session?.user.id,
                name: session?.user.username,
                gender,
                country,
                region,
                dob,
                relation,
                bio,
                imageUrl
            },
        });

        const userOnboarded = await db.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                onboarded: true,
            }
        });



        return NextResponse.json({ upsertUser, userOnboarded, message: "Profile modifié !" }, { status: 201 });

    } catch (error) {
        console.log("[ROUTE_PUT]", error);
        return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 });
    }

}

export async function GET(req: Request) {

    try {

        const getProfileById = await db.profile.findMany({
            orderBy:
            {
                createdAt: 'desc',
            },
            take: 10,
        })

        return NextResponse.json({ getProfileById }, { status: 200 })
    } catch (error) {
        console.log("[ROUTE_GETBYID]", error);
        return NextResponse.json({ message: "Une erreur s'est produite" }, { status: 500 });
    }
}

