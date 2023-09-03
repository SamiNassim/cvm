import { FC, ReactNode } from "react";
import { Button } from "./ui/button";

interface GoogleLoginButtonProps {
    children: ReactNode;
}

const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({ children }) => {

    function loginWithGoogle() {
        console.log("Login with Google");
    }

    return (
        <Button onClick={loginWithGoogle} className="w-full">{children}</Button>
    )
}

export default GoogleLoginButton;