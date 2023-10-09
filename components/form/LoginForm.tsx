"use client"

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import GoogleLoginButton from "../GoogleLoginButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"


const FormSchema = z.object({
    email: z.string().min(1, "Entrez votre email").email("Email incorrect"),
    password: z
        .string()
        .min(1, "Entrez votre mot de passe")
        .min(8, "Le mot de passe doit avoir 8 caractères minimum"),
});

const LoginForm = () => {

    const router = useRouter();
    const { toast } = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        const signInData = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (signInData?.error === null) {
            router.refresh();
            router.push("/home");
        } else {
            toast({
                title: "Erreur",
                description: "Une erreur s'est produite !",
                variant: "destructive",
            })
        }
    }

    return (
        <Form    {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@exemple.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Mot de passe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                </div>

                <Button className="w-full mt-6" type="submit">Login</Button>
            </form>
            <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                ou
            </div>
            <GoogleLoginButton>Se connecter avec Google</GoogleLoginButton>
            <p className="text-center text-sm text-gray-600 mt-2">
                <Link className="text-blue-500 hover:underline" href="/register">Créer un compte</Link>
            </p>
        </Form>
    )
}

export default LoginForm;