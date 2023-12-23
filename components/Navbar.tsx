import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Heart, Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import { db } from "@/lib/db";
import { Badge } from "@nextui-org/badge";

const Navbar = async () => {

    const session = await getServerSession(authOptions);

    if (session) {
        const goOnline = await db.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                isOnline: true,
            }
        })
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

    return (
        <header className="bg-zinc-100 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-14 container flex items-center justify-between">
                <Link href={session?.user ? ("/home") : ("/")}>
                    <Heart strokeWidth={1.5} />
                </Link>
                {session?.user ? (
                    <>
                        <div className="absolute inset-x-2/4">
                            <Link className="flex" href={"/messages"}>
                                <Badge className={unreadMessages === 0 ? "hidden" : ""} placement="top-right" content={unreadMessages} color="danger" shape="circle" size="md" showOutline={false}>
                                    <Mail strokeWidth={1.5} />
                                </Badge>
                            </Link>
                        </div>
                        <UserAccountNav />
                    </>
                ) : (
                    <Link className={buttonVariants()} href="/login">
                        Login
                    </Link>
                )}

            </div>
        </header>
    )
}

export default Navbar;