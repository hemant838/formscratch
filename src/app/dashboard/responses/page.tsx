"use client";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { desc ,eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListResponse from "./_component/FormListResponse";

function page() {
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
        <div className="p-10">
            <h2 className="font-bold text-3xl flex items-center justify-between">
                Responses
            </h2>

            <div className="grid grid-cols-1 gap-4 mt-4">
                {formList.map((form, index) => (
                    <FormListResponse
                        formRecord={form}
                        jsonForm={JSON.parse(form.jsonform)}
                    />
                ))}
            </div>
        </div>
    );
}

export default page;
