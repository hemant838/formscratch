"use client";

import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useCallback, useEffect, useState } from "react";
import FormListResponse from "./_component/FormListResponse";

function Page() {
    const { user } = useUser();
    const [formList, setFormList] = useState<any[]>([]);

    const getFormList = useCallback(async () => {
        if (!user) return; // Ensure user is defined before querying
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
    }, [getFormList]); // Added getFormList to dependency array

    return (
        <div className="p-10">
            <h2 className="font-bold text-3xl flex items-center justify-between">
                Responses
            </h2>

            <div className="grid grid-cols-1 gap-4 mt-4">
                {formList.map((form) => (
                    <FormListResponse
                        key={form.id} // Added key prop
                        formRecord={form}
                        jsonForm={JSON.parse(form.jsonform)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Page;
