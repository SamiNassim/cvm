import RegisterForm from "@/components/form/RegisterForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const RegisterPage = async () => {

    const session = await getServerSession(authOptions);

    if (session?.user) {
        return redirect("/");
    }

    return (
        <div className="w-full">
            <RegisterForm />
        </div>
    )
}

export default RegisterPage;