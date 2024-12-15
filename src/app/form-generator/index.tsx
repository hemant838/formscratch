"use client"
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateForm } from "@/config/generateForm";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

type Props = {};

const initialState: {
    message: string;
    formId?: any; // formId should be a number or undefined
} = {
    message: "",
};

export function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Generating..." : "Generate"}
        </Button>
    );
}

const FormGenerator = (props: Props) => {
    const [state, formAction] = useFormState(generateForm, initialState);
    const [open, setOpen] = useState(false);
    const router = useRouter(); // Hook for client-side navigation

    const onFormCreate = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (state.message === "Form created successfully" && state.formId) {
            router.push(`/edit-form/${state.formId}`); // Redirect to the dynamic form page
        }
    }, [state.message, state.formId, router]); // Check directly for formId

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={onFormCreate}>Create Form</Button>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Your Form</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Share what your form is about, who it is for, and what information you would like to collect. AI will do the magic!"
                        />
                    </div>

                    <DialogFooter>
                        <SubmitButton />
                        <Button variant="link">Create manually</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormGenerator;
