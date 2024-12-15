"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/config";
import { userResponses } from "@/config/schema";
import { Edit, Loader2, Share, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { RWebShare } from "react-web-share";
import { eq } from "drizzle-orm";
import * as XLSX from "xlsx";

function FormListResponse({ jsonForm, formRecord }: any) {
    const [loading, setIsLoading] = useState(false);

    const exportData = async() => {
        let data: any[] = [];
        setIsLoading(true);
        const result = await db
            .select()
            .from(userResponses)
            .where(eq(userResponses.formRef, formRecord.id));

        console.log(result);

        if (result) {
            result.forEach((res) => {
                const jsonItem = JSON.parse(res.jsonresponse);
                data.push(jsonItem);
            })
            setIsLoading(false);
        }
        console.log(data);
        exportToExcel(data);
        
    };

    // convert json to excel
    const exportToExcel = (data: any[]) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, jsonForm?.formTitle+".xlsx");
    }

    return (
        <div className="border shadow-sm rounded-lg p-5 my-5">
            <h2 className="text-lg text-black font-semibold">
                {jsonForm?.formTitle}
            </h2>
            <h2 className="text-sm text-gray-500 mb-4">
                {jsonForm?.formHeading}
            </h2>
            <hr className="my-4" />

            <div className="flex justify-between items-center">
                <h2>
                    <strong>45 </strong>
                    Response
                </h2>
                <Button
                    className=""
                    size="sm"
                    onClick={() => exportData()}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Export"}
                </Button>
            </div>
        </div>
    );
}

export default FormListResponse;
