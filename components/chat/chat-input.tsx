"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";


import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Plus, Smile } from "lucide-react";
import qs from "query-string";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation"
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type
}: ChatInputProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        }
    })

    const router = useRouter();
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url, values);

            form.reset();
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        onClick={() => { }}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 hover:bg-slate-600 transition rounded-full p-1 flex items-center justify-center">
                                        <Plus className="text-white" />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-200/90 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600"
                                        placeholder="Entrez votre message"
                                        {...field} />
                                    <div className="absolute top-7 right-8">
                                        <Smile />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}