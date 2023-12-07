import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Heart, Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {

    const session = await getServerSession(authOptions);

    return (
        <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0 dark:bg-[#25232a]">
            <div className="container flex items-center justify-between">
                <Link href={session?.user ? ("/home") : ("/")}>
                    <Heart strokeWidth={1.5} />
                </Link>
                {session?.user ? (
                    <>
                        <div /* className="absolute left-2/4" */><Link href={"/messages"}><Mail strokeWidth={1.5} /></Link></div>
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