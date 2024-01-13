import { SocketIndicator } from "@/components/socket-indicator";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { authOptions } from "@/lib/auth";
import { getOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface MessagesFromIdProps {
    params: {
        id: string;
    },
    searchParams: {
        video?: boolean;
    }
}

const MessagesFromId = async ({
    params,
    searchParams,
}: MessagesFromIdProps) => {

    const session = await getServerSession(authOptions);

    const currentUser = await db.user.findFirst({
        where: {
            id: session?.user.id
        },
        include: {
            profile: true,
        }
    })

    if (!currentUser) {
        return redirect("/login");
    }

    const conversation = await getOrCreateConversation(currentUser!.id, params.id)

    if (!conversation) {
        return redirect("/home");
    }

    const { userOne, userTwo } = conversation;

    const otherUser = userOne.id === session?.user.id ? userTwo : userOne;


    return (
        <>
            <div className="flex mt-20"><SocketIndicator /></div>
            <div className="w-full h-full mt-20 flex flex-col">

                <ChatMessages
                    user={currentUser}
                    name={otherUser.username!}
                    chatId={conversation.id}
                    type="conversation"
                    apiUrl="/api/messages"
                    paramKey="conversationId"
                    paramValue={conversation.id}
                    socketUrl="/api/socket/messages"
                    socketQuery={{
                        conversationId: conversation.id,
                    }}
                />
                <ChatInput
                    name={otherUser.username!}
                    type="conversation"
                    apiUrl="/api/socket/messages"
                    query={{
                        conversationId: conversation.id,
                    }}
                />
            </div>


        </>

    )
}

export default MessagesFromId;