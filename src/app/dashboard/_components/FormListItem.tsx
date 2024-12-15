import { Button } from "@/components/ui/button";
import { Edit, Share, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { RWebShare } from "react-web-share";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import { json } from "stream/consumers";

function FormListItem({ formRecord, jsonform, refreshData }: any) {
    const { user } = useUser();

    const onDeleteForm = async () => {
        const result = await db
            .delete(JsonForms)
            .where(
                and(
                    eq(JsonForms.id, formRecord.id),
                    eq(
                        JsonForms.createdBy,
                        user?.primaryEmailAddress?.emailAddress ?? ""
                    )
                )
            );
        if (result) {
            toast.success("Form deleted successfully");
            refreshData();
        }
    };
    return (
        <div className="border shadow-sm rounded-lg p-5 my-5">
            <div className="flex justify-between ">
                <h2></h2>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Trash className="h-5 w-5 text-red-700 cursor-pointer hover:scale-105 transition-all" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteForm()}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <h2 className="text-lg text-black font-semibold">
                {jsonform.formTitle}
            </h2>
            <h2 className="text-sm text-gray-500 mb-4">
                {jsonform.formHeading}
            </h2>
            <hr className="my-4" />

            <div className="flex flex-col sm:flex-row justify-between items-center">
                <RWebShare
                    data={{
                        text:
                            jsonform?.formHeading +
                            ", Build Your Form in Seconds",
                        url:
                            process.env.NEXT_PUBLIC_BASE_URL +
                            "/aiform/" +
                            formRecord.id,
                        title: jsonform?.formTitle,
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

                <Link href={"/edit-form/" + formRecord.id}>
                    <Button size="sm" className="flex gap-2 w-full sm:w-auto">
                        <Edit className="h-5 w-5" /> Edit
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default FormListItem;
