import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const goOnline = await db.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                isOnline: true,
            },
        })

        return NextResponse.json({ message: "User connected" }, { status: 201 });

    } catch (error) {
        console.log("[PATCH_ONLINE_API]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }

}