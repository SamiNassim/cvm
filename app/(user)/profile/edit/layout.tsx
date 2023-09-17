import { FC, ReactNode } from "react";

interface EditLayoutProps {
    children: ReactNode;
}

const EditLayout: FC<EditLayoutProps> = ({ children }) => {
    return (
        <div className="p-10 rounded-md">{children}</div>
    )
}

export default EditLayout;