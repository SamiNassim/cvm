import ConversationsList from "@/components/ConversationsList";
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
                }
            }
        }
    })

    console.log("CONVLIST", conversationsList[0].messages[0])

    return (
        <ConversationsList convData={conversationsList} session={session} />
    )
}

export default Messages;