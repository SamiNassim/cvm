import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


const UserProtected = async ({ children }: { children: React.ReactNode }) => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/login")
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtected;