import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const goOffline = await db.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                isOnline: false,
            },
        })

        return NextResponse.json({ message: "User disconnected" }, { status: 201 });

    } catch (error) {
        console.log("[PUT_OFFLINE_API]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }

}