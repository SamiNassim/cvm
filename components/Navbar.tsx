import Link from "next/link";
import { Heart, Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import { db } from "@/lib/db";
import { Badge } from "@nextui-org/badge";
import { Button } from "@nextui-org/button";
import NavbarNew from "./NavbarNew";

const Navbar = async () => {

    const session = await getServerSession(authOptions);

    return (
        <header className="w-full">
            <NavbarNew session={session} />
        </header>
    )
}

export default Navbar;