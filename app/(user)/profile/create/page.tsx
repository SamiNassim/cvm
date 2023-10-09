import ProfileCreateForm from "@/components/form/ProfileCreateForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const CreateProfile = async () => {

    const session = await getServerSession(authOptions);
    console.log(session);

    return (
        <div className="w-full">
            <ProfileCreateForm />
        </div>
    )
}

export default CreateProfile;