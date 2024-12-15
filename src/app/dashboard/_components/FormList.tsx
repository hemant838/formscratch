"use client";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect } from "react";
import { set } from "zod";
import FormListItem from "./FormListItem";

function FormList() {
    const { user } = useUser();
    const [formList, setFormList] = React.useState<any[]>([]);

    useEffect(() => {
        user && getFormList();
    }, [user]);

    const getFormList = async () => {
        const result = await db
            .select()
            .from(JsonForms)
            .where(
                eq(
                    JsonForms.createdBy,
                    user?.primaryEmailAddress?.emailAddress ?? ""
                )
            )
            .orderBy(desc(JsonForms.id));
        setFormList(result);
        console.log(result);
    };
    return (
        <div className="mt-5 grid lg:grid-cols-4 md:grid-cols-3 md:gap-1 gap-5">
            {formList.map((form, index) => (
                <div>
                    <FormListItem
                        jsonform={JSON.parse(form.jsonform)}
                        formRecord={form}
                        refreshData={getFormList}
                    />
                </div>
            ))}
        </div>
    );
}

export default FormList;
