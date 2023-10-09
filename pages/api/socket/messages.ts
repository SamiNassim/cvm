import { authOptions } from "@/lib/auth";
import { NextApiResponseServerIo } from "@/types/socketio";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {

        const session = await getServerSession(req, res, authOptions)
        const { content, fileUrl } = req.body;
        const { conversationId } = req.query;

        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID missing" });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        userOne: {
                            id: session.user.id,
                        }
                    },
                    {
                        userTwo: {
                            id: session.user.id,
                        }
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

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const user = conversation.userOne.id === session.user.id ?
            conversation.userOne : conversation.userTwo;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                userId: user.id
            },
            include: {
                user: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    }
    catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
