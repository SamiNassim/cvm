"use client"

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import GoogleLoginButton from "../GoogleLoginButton";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

const FormSchema = z.object({
    username: z.string().min(2, "Nom d'utilisateur requis").max(30),
    email: z.string().min(1, "Entrez votre email").email("Email incorrect"),
    password: z.
        string()
        .min(1, "Entrez votre mot de passe")
        .min(8, "Le mot de passe doit avoir 8 caractères minimum"),
    confirmPassword: z.string().min(1, "Mot de passe requis")
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Les mots de passes ne correspondent pas"
    });


const RegisterForm = () => {

    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        const response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password
            })
        })

        if (response.ok) {
            router.push("/login")
            toast({
                title: "Notification",
                description: "Compte créé avec succès !",

            })
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
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom d'utilisateur</FormLabel>
                                <FormControl>
                                    <Input placeholder="Pseudo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Répétez le mot de passe</FormLabel>
                                <FormControl>
                                    <Input placeholder="Répétez le mot de passe" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                </div>

                <Button className="w-full mt-6" type="submit">Créer un compte</Button>
            </form>
            <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                ou
            </div>
            <GoogleLoginButton>Créer un compte avec Google</GoogleLoginButton>
            <p className="text-center text-sm text-gray-600 mt-2">
                <Link className="text-blue-500 hover:underline" href="/login">Se connecter</Link>
            </p>
        </Form>
    )
}

export default RegisterForm;