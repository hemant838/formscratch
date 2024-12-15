"use client";

import FormUi from "@/app/edit-form/_components/FormUi";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";

interface Field {
    placeholder: string;
    label: string;
    fieldName: string;
    fieldTitle: string;
    fieldType: string;
}

interface EditFormProps {
    params: {
        formid: string | undefined;
    };
}

const LiveAiForm: React.FC<EditFormProps> = ({ params }) => {
    const [record, setRecord] = useState<
        | {
              id: number;
              jsonform: string | null;
              theme: string;
              background: string | null;
              style: string | null;
              createdBy: string;
              createdAt: string;
          }
        | undefined
    >(undefined);
    const [jsonForm, setJsonForm] = useState<{
        formTitle: string;
        formHeading: string;
        fields: Field[];
    }>({
        formTitle: "",
        formHeading: "",
        fields: []
    });

    useEffect(() => {
        const fetchData = async () => {
            if (params) {
                await GetFormData();
            }
        };
        fetchData();
    }, [params]);

    const GetFormData = async () => {
        const result = await db
            .select()
            .from(JsonForms)
            .where(eq(JsonForms.id, Number(params?.formid)));
        setRecord(result[0]);
        setJsonForm(result[0].jsonform ? JSON.parse(result[0].jsonform) : {
            formTitle: "",
            formHeading: "",
            fields: []
        });
        console.log(result);
    };


    return <div className="p-10 flex justify-center items-center" style={ {
        backgroundImage: record?.background || ""
    }}>
        <FormUi jsonForm={jsonForm}
        onFieldUpdate={() => console.log}
        deleteField={() => console.log}
        selectedTheme={record?.theme || ""}
        editable={false}
        formId={record?.id ?? 0}
        />

    </div>;
};

export default LiveAiForm;
