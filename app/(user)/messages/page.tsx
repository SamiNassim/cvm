import ConversationsList from "@/components/ConversationsListNew";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

const Messages = async () => {

    const session = await getServerSession(authOptions);

    const conversationsList = await db.conversation.findMany({
        where: {
            OR: [{

                userOneId: session?.user.id,

            },
            {
                userTwoId: session?.user.id,
            }]

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
            },
            messages: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                },
            }
        }
    })

    return (
        <ConversationsList convData={conversationsList} session={session} />
    )
}

export default Messages;