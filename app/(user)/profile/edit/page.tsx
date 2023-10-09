import ProfileEditForm from "@/components/form/ProfileEditForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const UpdateProfile = async () => {

    const session = await getServerSession(authOptions);
    console.log(session);

    return (
        <div className="w-full">
            <ProfileEditForm />
        </div>
    )
}

export default UpdateProfile;