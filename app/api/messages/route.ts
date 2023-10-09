import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

const MESSAGES_BATCH = 10;


export async function GET(req: Request) {

    try {

        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId,
                },
                include: {
                    user: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId,
                },
                include: {
                    user: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        }

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        });


    } catch (error) {
        console.log("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }


}
