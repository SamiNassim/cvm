import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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