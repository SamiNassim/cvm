import { FC, ReactNode } from "react";
import { Button } from "@nextui-org/button";
import { signIn } from "next-auth/react";
import GoogleIcon from "./GoogleIcon";

interface GoogleLoginButtonProps {
    children: ReactNode;
}

const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({ children }) => {

    function loginWithGoogle() {

        // Change URL for production
        signIn("google", {
            callbackUrl: "http://localhost:3000/home"
        })
    }

    return (
        <Button onClick={loginWithGoogle} color="primary" radius="sm" className="w-full" startContent={<GoogleIcon />}>{children}</Button>
    )
}

export default GoogleLoginButton;