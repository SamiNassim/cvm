import ProfileEditForm from "@/components/form/ProfileEditForm";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

const CreateProfile = async () => {

    const session = await getServerSession(authOptions);

    const currentProfile = await db.user.findFirst({
        where: { id: session?.user.id },
        include: {
            profile: true,
        },
    })

    return (
        <div className="w-full">
            <ProfileEditForm session={session} currentProfile={currentProfile} />
        </div>
    )
}

export default CreateProfile;