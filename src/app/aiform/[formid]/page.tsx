"use client";

import FormUi from "@/app/edit-form/_components/FormUi";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { eq } from "drizzle-orm";
import React, { useCallback, useEffect, useState } from "react";

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
              enableSignIn: boolean;
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

    const GetFormData = useCallback(async () => {
        const result = await db
            .select()
            .from(JsonForms)
            .where(eq(JsonForms.id, Number(params?.formid)));
        setRecord({
            ...result[0],
            enableSignIn: result[0].enabelSignIn ?? false
        });
        setJsonForm(result[0].jsonform ? JSON.parse(result[0].jsonform) : {
            formTitle: "",
            formHeading: "",
            fields: []
        });
        console.log(result);
    },[params?.formid]);

    useEffect(() => {
        const fetchData = async () => {
            if (params) {
                await GetFormData();
            }
        };
        fetchData();
    }, [params, GetFormData]);


    return <div className="p-10 flex justify-center items-center" style={ {
        backgroundImage: record?.background || ""
    }}>
        <FormUi jsonForm={jsonForm}
        onFieldUpdate={() => console.log}
        deleteField={() => console.log}
        selectedTheme={record?.theme || ""}
        editable={false}
        formId={record?.id ?? 0}
        enableSignIn= {record?.enableSignIn}
        />

    </div>;
};

export default LiveAiForm;
