import { FC, ReactNode } from "react";

interface ProfileCreateLayoutProps {
    children: ReactNode;
}

const ProfileCreateLayout: FC<ProfileCreateLayoutProps> = ({ children }) => {
    return (
        <div className="p-10 rounded-md">{children}</div>
    )
}

export default ProfileCreateLayout;