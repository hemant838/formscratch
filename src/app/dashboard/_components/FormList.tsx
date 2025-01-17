"use client";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useCallback, useEffect, useState } from "react";
import FormListItem from "./FormListItem";

function FormList() {
    const { user } = useUser();
    const [formList, setFormList] = useState<any[]>([]);

    const getFormList = useCallback(async () => {
        if (!user) return; // Ensure user exists before making the query
        const result = await db
            .select()
            .from(JsonForms)
            .where(
                eq(
                    JsonForms.createdBy,
                    user.primaryEmailAddress?.emailAddress ?? ""
                )
            )
            .orderBy(desc(JsonForms.id));
        setFormList(result);
        console.log(result);
    }, [user]);

    useEffect(() => {
        getFormList();
    }, [getFormList]);

    return (
        <div className="mt-5 grid lg:grid-cols-4 md:grid-cols-3 md:gap-1 gap-5">
            {formList.map((form) => (
                <div key={form.id}> {/* Use a unique property from the form as the key */}
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
