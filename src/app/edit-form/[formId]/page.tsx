"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { eq, and } from "drizzle-orm";
import { ArrowLeft, Share, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FormUi from "../_components/FormUi";
import { toast } from "sonner";
import Controller from "../_components/Controller";
import Link from "next/link";
import { RWebShare } from "react-web-share";

interface EditFormProps {
    params: {
        formId: string | undefined;
    };
}

interface Field {
    label: string;
    placeholder: string;
    fieldName: string;
    fieldTitle: string;
    fieldType: string;
}

interface JsonForm {
    formTitle: string;
    formHeading: string;
    fields: Field[];
}

interface Record {
    id: number;
    jsonform: string | null;
    theme: string;
    background: string | null;
    style: string | null;
    createdBy: string;
    createdAt: string;
}

const EditForm: React.FC<EditFormProps> = ({ params }) => {
    const { user } = useUser();
    const [jsonForm, setJsonForm] = useState<JsonForm>({
        formTitle: "",
        formHeading: "",
        fields: [],
    });
    const router = useRouter();
    const [updateTrigger, setUpdateTrigger] = useState<number | undefined>(
        undefined
    );
    const [record, setRecord] = useState<Record | null>(null);
    const [selectedTheme, setSelectedTheme] = useState("light");
    const [selectedBackground, setSelectedBackground] = useState<string>("");

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const result = await db
                    .select()
                    .from(JsonForms)
                    .where(
                        and(
                            eq(JsonForms.id, parseInt(params.formId!)),
                            eq(
                                JsonForms.createdBy,
                                user?.primaryEmailAddress?.emailAddress ?? ""
                            )
                        )
                    );
                setRecord(result[0]);
                setJsonForm(
                    result[0]?.jsonform
                        ? JSON.parse(result[0].jsonform)
                        : { formTitle: "", formHeading: "", fields: [] }
                );
                setSelectedBackground(result[0]?.background ?? "");
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        };

        if (user) fetchFormData();
    }, [user, params.formId]);

    useEffect(() => {
        if (updateTrigger) {
            setJsonForm(jsonForm);
            updateJsonFormDb();
        }
    }, [updateTrigger]);

    const onFieldUpdate = (value: any, index: any) => {
        jsonForm.fields[index].label = value.label;
        jsonForm.fields[index].placeholder = value.placeholder;
        setUpdateTrigger(Date.now());
    };

    const updateJsonFormDb = async () => {
        const result = await db
            .update(JsonForms)
            .set({
                jsonform: JSON.stringify(jsonForm),
            })
            .where(
                and(
                    eq(JsonForms.id, record?.id ?? 0),
                    eq(
                        JsonForms.createdBy,
                        user?.primaryEmailAddress?.emailAddress ?? ""
                    )
                )
            );
        toast("Form Updated Successfully");
        console.log(result);
    };

    const deleteField = (indexToRemove: number) => {
        const result = jsonForm.fields.filter(
            (_, index) => index !== indexToRemove
        );
        jsonForm.fields = result;
        setUpdateTrigger(Date.now());
    };

    const updateControllerFields = async (
        value: string | boolean,
        columnName: string
    ) => {
        const themeToSave = columnName === "theme" && !value ? "light" : value;

        const result = await db
            .update(JsonForms)
            .set({
                [columnName]: themeToSave,
            })
            .where(
                and(
                    eq(JsonForms.id, record?.id ?? 0),
                    eq(
                        JsonForms.createdBy,
                        user?.primaryEmailAddress?.emailAddress ?? ""
                    )
                )
            );
        toast("Form Updated Successfully");
    };

    return (
        <div className="p-10">
            <div className="flex justify-between items-center">
                <h2
                    className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
                    onClick={() => router.back()}
                >
                    <Button>
                        <ArrowLeft /> Back
                    </Button>
                </h2>
                <div className="flex gap-2">
                    <Link href={`/aiform/` + record?.id} target="_blank">
                        <Button className="flex gap-2">
                            <SquareArrowOutUpRight className="h-5 w-5 " /> Live
                            Preview
                        </Button>
                    </Link>

                    <RWebShare
                        data={{
                            text:
                                jsonForm?.formHeading +
                                ", Build Your Form in Seconds",
                            url:
                                process.env.NEXT_PUBLIC_BASE_URL +
                                "/aiform/" +
                                record?.id,
                            title: jsonForm?.formTitle,
                        }}
                        onClick={() => console.log("shared successfully!")}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex gap-2 mb-3 sm:mb-0 w-full sm:w-auto"
                        >
                            <Share className="h-5 w-5" /> Share
                        </Button>
                    </RWebShare>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
                <div className="p-5 border rounded-lg  shadow-md">
                    <Controller
                        selectedTheme={(value: any) => {
                            updateControllerFields(value, "theme");
                            setSelectedTheme(value);
                        }}
                        selectedBackground={(value) => {
                            updateControllerFields(value, "background");
                            setSelectedBackground(value);
                        }}
                        setSignInEnable={(value: boolean) => {
                            updateControllerFields(value, "enabelSignIn");
                        }}
                    />
                </div>
                <div
                    className="col-span-2 border rounded-lg p-5  flex items-center justify-center"
                    style={{
                        backgroundImage: selectedBackground,
                    }}
                >
                    <FormUi
                        formId={parseInt(params.formId!)}
                        jsonForm={jsonForm}
                        selectedTheme={selectedTheme}
                        onFieldUpdate={onFieldUpdate}
                        deleteField={(index) => deleteField(index)}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditForm;
