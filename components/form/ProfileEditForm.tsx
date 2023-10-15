"use client"

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod";
import FileUpload from "@/components/FileUpload";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";


const formSchema = z.object({
    gender: z.string().min(1, "Veuillez choisir votre genre"),
    country: z.string().min(1, "Veuillez choisir votre pays"),
    region: z.string().min(1, "Veuillez choisir une région"),
    dob: z.date(),
    relation: z.string(),
    bio: z.string().max(500),
    imageUrl: z.string(),
});



function ProfileEditForm({ session, currentProfile }: any) {

    if (!session) {
        redirect("/login");
    }

    const [country, setCountry] = useState(currentProfile && currentProfile.profile.country ? currentProfile.profile.country : "");
    const [didMount, setDidMount] = useState(false)

    const router = useRouter();



    console.log(currentProfile);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gender: currentProfile.profile.gender ? currentProfile.profile.gender : "",
            country: currentProfile.profile.country ? currentProfile.profile.country : "",
            region: currentProfile.profile.region ? currentProfile.profile.region : "",
            dob: currentProfile.profile.dob ? parseISO(currentProfile.profile.dob) : new Date,
            relation: currentProfile.profile.relation ? currentProfile.profile.relation : "",
            bio: currentProfile.profile.bio ? currentProfile.profile.bio : "",
            imageUrl: currentProfile.profile.imageUrl ? currentProfile.profile.imageUrl : "",
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
                name: session?.user.username,
                gender: values.gender,
                country: values.country,
                region: values.region,
                dob: values.dob,
                relation: values.relation,
                bio: values.bio,
                imageUrl: values.imageUrl,
            })
        })

        if (response.ok) {
            router.push("/home");
            router.refresh();
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

    // This is a check for the first render
    useEffect(() => {
        setDidMount(true)
    }, []);

    // We only trigger this effect afther the first render
    useEffect(() => {
        if (didMount) {
            setTimeout(() => {
                form.reset({
                    country: country,
                    region: ""
                })
            }, 1000)
        }
    }, [country])

    console.log(form.formState.errors)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="mt-[200px]">
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
                                            defaultMonth={new Date(2005, 8)}
                                            /* captionLayout="dropdown"
                                            fromYear={1925} toYear={2025} */
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
                                        onChange={(val) => {
                                            field.onChange(val)
                                        }} />
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
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FileUpload
                                    endpoint="userImage"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}

                />
                {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Picture</Label>
                    <Input id="picture" type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                </div> */}
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default ProfileEditForm;