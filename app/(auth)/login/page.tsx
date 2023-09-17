import LoginForm from "@/components/form/LoginForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {

    const session = await getServerSession(authOptions);

    if (session?.user) {
        return redirect("/");
    }

    return (
        <div className="w-full">
            <LoginForm />
        </div>
    )
}

export default LoginPage;