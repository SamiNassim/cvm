import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavbarNew from "./navbar";

const NavbarPage = async () => {

    const session = await getServerSession(authOptions);

    console.log("navbarlog", session)

    return (
        <header className="w-full">
            <NavbarNew session={session} />
        </header>
    )
}

export default NavbarPage;