import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getAge } from "@/lib/age-calculator";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Mail, Pencil } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

const ProfilePage = async ({ params }: { params: { id: string } }) => {


    const userInfo = await db.user.findFirst({
        where: { id: params.id },
        include: {
            profile: true,
        },
    })

    const session = await getServerSession(authOptions);
    const userAge = getAge(userInfo?.profile.dob!);

    return (
        <>
            <div className="w-full h-full p-10">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={userInfo?.profile.imageUrl!} />
                            <AvatarFallback>{userInfo?.username}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl">{userInfo?.username}</h1>
                        {session?.user.id === params.id ? <Link href="edit"><Pencil /></Link> : <Link href={`/messages/${userInfo?.id}`}><Mail /></Link>}
                    </div>
                    <div>
                        <h2 className="text-sm">{userInfo?.profile.gender}</h2>
                        <h2 className="text-sm">{userAge} ans</h2>
                        <h2 className="text-sm">{userInfo?.profile.relation}</h2>
                    </div>
                </div>
                <Separator className="my-4 w-full" />
                <div className="w-full">
                    <div className="flex flex-col">
                        <h2>{userInfo?.profile.country}</h2>
                        <h2>{userInfo?.profile.region}</h2>
                    </div>
                </div>
            </div>
            <div className="flex w-full h-full justify-center items-center">
                {userInfo?.profile.bio!}
            </div>
        </>
    )
}

export default ProfilePage;