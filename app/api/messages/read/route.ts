import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {

    const body = await req.json();

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentConversation = await db.conversation.findFirst({
            where: {
                OR: [
                    {
                        userOneId: session.user.id,
                        userTwoId: body.id,
                    },
                    {
                        userOneId: body.id,
                        userTwoId: session.user.id,
                    }
                ]

            },
            include: {
                userOne: {
                    include: {
                        profile: true,
                    }
                },
                userTwo: {
                    include: {
                        profile: true,
                    }
                }
            }
        })

        const user = currentConversation?.userOne.id === session.user.id ?
            currentConversation?.userOne : currentConversation?.userTwo;

        const updateMessages = await db.conversation.update({
            where: {
                id: currentConversation?.id,
            },
            data: {
                ...(user === currentConversation?.userOne ? { userOneUnread: 0 } : { userTwoUnread: 0 }),
            },
        })

        return NextResponse.json({ message: "Messages read." }, { status: 201 });

    } catch (error) {
        console.log("[PUT_READ_API]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }

}