import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Profile } from "@prisma/client";
import UserCard from "@/components/UserCard";

const Home = async () => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/")
    }

    const getUsers = async () => {
        const response = await fetch(process.env.URL + '/api/profile', {
            method: "GET"
        })
        if (response.ok) {
            return response.json();
        }
    }

    const users = await getUsers();

    console.log(users)

    return (
        <div className='flex flex-col items-center gap-4'>
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
    )
}

export default Home;