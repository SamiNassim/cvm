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
        <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0 dark:bg-[#25232a]">
            <div className="container flex items-center justify-between">
                <Link href={session?.user ? ("/home") : ("/")}>
                    <Heart strokeWidth={1.5} />
                </Link>
                {session?.user ? (
                    <>
                        <div><Link className="flex" href={"/messages"}><Badge className={unreadMessages === 0 ? "hidden" : ""} placement="top-right" content={unreadMessages} color="danger" shape="circle" size="md" showOutline={false}><Mail strokeWidth={1.5} /></Badge></Link></div>
                        <UserAccountNav />
                    </>
                ) : (
                    <Link className={buttonVariants()} href="/login">
                        Login
                    </Link>
                )}

            </div>
        </div>
    )
}

export default Navbar;