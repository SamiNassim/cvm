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
import { Button } from "../ui/button";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { format, parseISO } from "date-fns";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr)
setDefaultLocale('fr');

const dateFormatArray = ["dd/MM/yyyy", "dd/MM/yy"];

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

    if (!session || !currentProfile) {
        redirect("/login");
    }

    const [country, setCountry] = useState(currentProfile && currentProfile.profile.country ? currentProfile.profile.country : "");
    const [didMount, setDidMount] = useState(false)

    const [startDate, setStartDate] = useState(new Date());

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

    // We only trigger this effect after the first render
    useEffect(() => {
        if (didMount) {
            setTimeout(() => {
                form.reset({
                    country: country,
                    region: ""
                }, { keepValues: true })
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
                                <FormControl>
                                    <DatePicker
                                        locale="fr"
                                        dateFormat={dateFormatArray}
                                        selected={field.value}
                                        onChange={(val) => {
                                            field.onChange(val)
                                        }}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                    />
                                </FormControl>
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