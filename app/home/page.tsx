import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Profile } from "@prisma/client";
import UserCard from "@/components/UserCard";

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

    let testVar = false;

    if (onboardingCheck) {
        testVar = true;
    }

    console.log(onboardingCheck)

    if (!session) {
        redirect("/");
    };

    if (session.user.id && !onboardingCheck?.onboarded && testVar) {
        redirect("/profile/edit");
    };

    const getUsers = async () => {
        const response = await fetch(process.env.URL + '/api/profile', {
            method: "GET"
        })
        if (response.ok) {
            return response.json();
        }
    }

    const users = await getUsers();

    return (
        <div className='flex flex-col pt-[70px] h-1/2 items-center'>
            <h1 className="mb-4">Derniers membres inscrits</h1>
            <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
                {users.getProfileById.map((userInfo: Profile) => {
                    return (
                        <UserCard
                            key={userInfo.id}
                            userId={userInfo.userId}
                            name={userInfo.name}
                            imageUrl={userInfo.imageUrl}
                            gender={userInfo.gender}
                            country={userInfo.country}
                            region={userInfo.region}
                            dob={userInfo.dob}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Home;