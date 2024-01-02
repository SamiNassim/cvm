import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userOneConversations = await db.conversation.findMany({
            where: {
                userOne: {
                    id: session?.user.id,
                },
            }
        })

        const userTwoConversations = await db.conversation.findMany({
            where: {
                userTwo: {
                    id: session?.user.id,
                },
            }
        })

        let convOneSum = 0;

        for (const conv of userOneConversations) {
            convOneSum += conv.userOneUnread
        }

        let convTwoSum = 0;

        for (const conv of userTwoConversations) {
            convTwoSum += conv.userTwoUnread
        }

        let unreadMessages = convOneSum + convTwoSum;

        return NextResponse.json(unreadMessages);

    } catch (error) {
        console.log("[PUT_READ_API]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }

}