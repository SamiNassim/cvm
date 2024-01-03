import { FC, ReactNode, useState } from "react";
import { Button } from "@nextui-org/button";
import { signIn } from "next-auth/react";
import GoogleIcon from "./GoogleIcon";

interface GoogleLoginButtonProps {
    children: ReactNode;
}

const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    function loginWithGoogle() {
        setIsLoading(true);
        // Change URL for production
        signIn("google", {
            callbackUrl: "http://localhost:3000/home"
        }
        )
    }

    return (
        <Button onClick={loginWithGoogle} isDisabled={isLoading} isLoading={isLoading} spinnerPlacement="end" color="primary" radius="sm" className="w-full" startContent={<GoogleIcon />}>{children}</Button>
    )
}

export default GoogleLoginButton;