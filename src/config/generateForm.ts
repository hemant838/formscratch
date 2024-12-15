"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from ".";
import { JsonForms } from "./schema";
import moment from "moment";
import { currentUser } from "@clerk/nextjs/server";

const apiKey: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
if (!apiKey) {
    throw new Error("API key is missing");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export async function generateForm(
    prevState: { message: string },
    formData: FormData
) {
    const user = await currentUser();

    const schema = z.object({
        description: z.string().min(1),
    });
    const parse = schema.safeParse({
        description: formData.get("description") as string,
    });

    if (!parse.success) {
        console.log(parse.error);
        return {
            message: "Failed to parse data",
        };
    }

    if (!apiKey) {
        return {
            message: "No API key found",
        };
    }

    const data = parse.data;

    const promptExplain =
        "Based on the description, generate a JSON object that represents a form with an array of fields and there will be a form title and form heading also. Each question should have 'placeholder' , 'label', 'field name','field title' and 'fieldType' properties, where fieldType can be 'RadioGroup', 'Select', 'Input', 'Textarea', or 'Switch'. For 'RadioGroup' and 'Select' types, include an additional 'fieldOption' array with objects containing 'text' and 'value' fields. For 'Input', 'Textarea', and 'Switch' types, the field options array should be empty.";

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(
            `${data.description} ${promptExplain}`
        );
        revalidatePath("/");

        let jsonResponse: any;
        try {
            jsonResponse = JSON.parse(await result.response.text());
        } catch (parseError) {
            console.error("Failed to parse response as JSON", parseError);
            return {
                message: "Failed to parse JSON response",
            };
        }

        const resp = await db
            .insert(JsonForms)
            .values({
                jsonform: JSON.stringify(jsonResponse),
                background: "", 
                style: "", 
                createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
                createdAt: moment().toISOString(),
            })
            .returning({ id: JsonForms.id });
        console.log("new Form ID", resp[0].id);

        return {
            message: "Form created successfully",
            formId: resp[0].id,
        };
    } catch (error) {
        console.log(error);
        return {
            message: "Failed to create form",
        };
    }
}
