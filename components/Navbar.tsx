import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Heart, Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {

    const session = await getServerSession(authOptions);

    return (
        <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
            <div className="container flex items-center justify-between">
                <Link href={session?.user ? ("/home") : ("/")}>
                    <Heart strokeWidth={1.5} />
                </Link>
                {session?.user ? (
                    <>
                        <Link href={"/messages"}><Mail strokeWidth={1.5} /></Link>
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