import ProfileForm from "@/components/form/ProfileForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const UpdateProfile = async () => {

    const session = await getServerSession(authOptions);
    console.log(session);

    return (
        <div className="w-full">
            <ProfileForm />
        </div>
    )
}

export default UpdateProfile;