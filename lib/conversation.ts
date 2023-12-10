import { db } from "@/lib/db";

export const getOrCreateConversation = async (userOneId: string, userTwoId: string) => {
    let conversation = await findConversation(userOneId, userTwoId) || await findConversation(userTwoId, userOneId);

    if (!conversation) {
        conversation = await createNewConversation(userOneId, userTwoId);
    }

    return conversation;
}

export const findConversation = async (userOneId: string, userTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { userOneId: userOneId },
                    { userTwoId: userTwoId },
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
    } catch {
        return null;
    }
}

const createNewConversation = async (userOneId: string, userTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                userOneId,
                userTwoId
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
    } catch {
        return null;
    }
} 