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
        <div className="bg-slate-200 p-10 rounded-md">{children}</div>
    )
}

export default AuthLayout;