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
        }
    })

    console.log("sessionlog", session)

    console.log("convlist", conversationsList)

    return (
        <div>
            Messages list
        </div>
    )
}

export default Messages;