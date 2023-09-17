"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { useSession } from "next-auth/react";

const formSchema = z.object({
    username: z.string().min(1, "Veuillez entrer un nom d'utilisateur"),
    email: z.string(),
    gender: z.string().min(1, "Veuillez choisir votre genre"),
    country: z.string().min(1, "Veuillez choisir votre pays"),
    region: z.string().min(1, "Veuillez choisir une région"),
    dob: z.date(),
    relation: z.string(),
    bio: z.string().max(500),
    image: z.string(),
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



function ProfileForm() {

    const [country, setCountry] = useState('');
    const router = useRouter();

    const { data: session } = useSession();


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            gender: "",
            country: "",
            region: "",
            dob: new Date,
            relation: "",
            bio: "",
            image: ""
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch("/api/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: values.username,
                email: session?.user.email,
                password: values.password,
                gender: values.gender,
                country: values.country,
                region: values.region,
                dob: values.dob,
                relation: values.relation,
                bio: values.bio,
                image: values.image,
            })
        })

        if (response.ok) {
            router.push("/")
            toast({
                title: "Notification",
                description: "Profil modifié avec succès !",
            })
        } else {
            toast({
                title: "Erreur",
                description: "Une erreur s'est produite !",
                variant: "destructive",
            })
        }
    }

    // States to manage the choice of country and region.

    console.log(form.formState.errors)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="mt-[200px]">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom d'utilisateur</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nom" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Votre nom d'utilisateur qui sera affiché.
                                </FormDescription>
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
                                    <Input placeholder="email@email.com" disabled/*  value={session?.user.email!}  */  {...field} />
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
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Je suis...</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Homme" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                un Homme
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Femme" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                une Femme
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date de naissance</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pays</FormLabel>
                                <FormControl>
                                    <CountryDropdown
                                        value={field.value}
                                        onChange={(val) => {
                                            setCountry(val)
                                            field.onChange(val)
                                        }}
                                        priorityOptions={["FR", "DZ", "MA", "TN"]} />
                                </FormControl>
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Region</FormLabel>
                                <FormControl>
                                    <RegionDropdown
                                        country={country}
                                        value={field.value}
                                        onChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="relation"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Je recherche...</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Amitié" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Une amitié
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Relation sérieuse" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Une relation sérieuse
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Mariage" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Le mariage
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Parlez de vous en quelques mots"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Picture</Label>
                    <Input id="picture" type="file" />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default ProfileForm;