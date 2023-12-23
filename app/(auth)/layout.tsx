import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = async ({ children }) => {

    const session = await getServerSession(authOptions);

    if (session?.user) {
        return redirect("/home")
    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center rounded-md">{children}</div>
    )
}

export default AuthLayout;