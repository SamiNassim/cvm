import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Homepage from "@/components/homepage";

const Home = async () => {

    const session = await getServerSession(authOptions);

    const onboardingCheck = await db.user.findFirst({
        where: {
            id: session?.user.id,
        },
        select: {
            onboarded: true,
        }
    })

    if (session && !onboardingCheck?.onboarded) {
        return redirect("/profile/edit")
    }

    return (
        <Homepage />
    )
}

export default Home;