import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import FieldEdit from "./FieldEdit";
import { db } from "@/config";
import { userResponses } from "@/config/schema";
import moment from "moment";
import { toast } from "sonner";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface Field {
    placeholder: string;
    label: string;
    fieldName: string;
    fieldTitle: string;
    fieldType: string;
    fieldOptions?: { text: string; value: string }[];
}

interface FormUiProps {
    jsonForm: {
        formTitle: string;
        formHeading: string;
        fields: Field[];
    };
    onFieldUpdate: (value: any, index: any) => void;
    deleteField: (index: number) => void;
    selectedTheme: string;
    editable?: boolean;
    formId: number;
    enableSignIn?: boolean;
}

const FormUi: React.FC<FormUiProps> = ({
    jsonForm,
    onFieldUpdate,
    deleteField,
    selectedTheme,
    editable = true,
    formId = 0,
    enableSignIn = false,
}) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    let formRef = useRef<HTMLFormElement | null>(null);
    const { user, isSignedIn } = useUser();

    const handleInputChange = (event: {
        target: { name: any; value: any };
    }) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckBoxChange = (
        fieldName: string,
        value: string,
        checked: boolean
    ) => {
        setFormData((prevState) => {
            // If the field already exists in formData, update its value
            const existingValue = prevState[fieldName] || [];
            const updatedValue = checked
                ? [...existingValue, value] // Add to array if checked
                : existingValue.filter((item: string) => item !== value); // Remove from array if unchecked

            return {
                ...prevState,
                [fieldName]: updatedValue, // Update the state for the specific field
            };
        });
    };

    const handleSelectChange = (name: any, value: any) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSwitchChange = (fieldName: string, checked: boolean) => {
        setFormData({
            ...formData,
            [fieldName]: checked, // Store boolean value
        });
    };
    const onFormSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        console.log(formData);

        const result = await db.insert(userResponses).values({
            jsonresponse: JSON.stringify(formData),
            createdAt: moment().format("YYYY-MM-DD"),
            formRef: formId,
        });

        if (result) {
            formRef.current?.reset();
            toast("Form submitted successfully");
        } else {
            toast("Form submission failed");
        }
    };
    return (
        <form
            ref={(e) => {
                formRef.current = e;
            }}
            onSubmit={onFormSubmit}
            className="border p-5 md:w-[600px] rounded-lg"
            data-theme={selectedTheme}
        >
            <h2 className="font-bold text-center text-2xl">
                {jsonForm?.formTitle}
            </h2>

            <h2 className="text-sm text-gray-400 text-center">
                {jsonForm?.formHeading}
            </h2>

            {jsonForm?.fields?.map((field, index) => (
                <div key={index} className=" flex items-center gap-2">
                    {/* Select Field */}
                    {field.fieldType === "Select" ? (
                        <div className="my-3 w-full">
                            <label className="text-xs text-gray-500">
                                {field.label}
                            </label>
                            <Select
                                onValueChange={(e) =>
                                    handleSelectChange(field.fieldName, e)
                                }
                            >
                                <SelectTrigger className="w-full bg-transparent">
                                    <SelectValue
                                        placeholder={field.placeholder}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.fieldOptions?.map((option, idx) => (
                                        <SelectItem
                                            key={idx}
                                            value={option.text}
                                        >
                                            {option.text}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : // RadioGroup Field
                    field.fieldType === "RadioGroup" ? (
                        <div className="my-3 w-full">
                            <label className="text-xs text-gray-500">
                                {field.placeholder}
                            </label>
                            <RadioGroup>
                                {field.fieldOptions?.map((option, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center space-x-2"
                                    >
                                        <RadioGroupItem
                                            value={option.value}
                                            id={option.value}
                                            onClick={() =>
                                                handleSelectChange(
                                                    field.fieldName,
                                                    option.value
                                                )
                                            }
                                        />
                                        <Label htmlFor={option.value}>
                                            {option.text}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ) : field.fieldType === "checkbox" ? (
                        <div className="my-3 w-full">
                            <label className="text-xs text-gray-500"> </label>
                            {field?.label}
                            {field?.fieldOptions ? (
                                field?.fieldOptions?.map((item, index) => (
                                    <div className="flex gap-2" key={index}>
                                        <Checkbox
                                            onCheckedChange={(
                                                checked: boolean
                                            ) =>
                                                handleCheckBoxChange(
                                                    field.fieldName,
                                                    item.value,
                                                    checked
                                                )
                                            }
                                        />
                                        <h2>{item.text}</h2>
                                    </div>
                                ))
                            ) : (
                                <div className="flex gap-2">
                                    <Checkbox
                                        onCheckedChange={(checked: boolean) =>
                                            handleCheckBoxChange(
                                                field.fieldName,
                                                field.fieldName,
                                                checked
                                            )
                                        }
                                    />
                                    <h2>{field.label}</h2>
                                </div>
                            )}
                        </div>
                    ) : field.fieldType === "Switch" ? (
                        <div className="flex gap-2 w-full">
                            <label className="text-xs text-gray-500">
                                {field.label}
                            </label>
                            <Switch
                                id={field.fieldName}
                                onCheckedChange={(checked: boolean) =>
                                    handleSwitchChange(field.fieldName, checked)
                                }
                            />
                        </div>
                    ) : (
                        // Input Field
                        <div className="my-3 w-full">
                            <label className="text-xs text-gray-500 ">
                                {field.label}
                            </label>
                            <Input
                                type={
                                    field.fieldType === "Input"
                                        ? "text"
                                        : undefined
                                }
                                placeholder={field.placeholder}
                                name={field.fieldName}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                    )}
                    {editable && (
                        <div>
                            <FieldEdit
                                field={field}
                                onUpdate={(value) =>
                                    onFieldUpdate(value, index)
                                }
                                deleteField={() => deleteField(index)}
                            />
                        </div>
                    )}
                </div>
            ))}

            {!enableSignIn ? (
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            ) : isSignedIn ? (
                <Button>
                    <SignInButton mode="modal">
                        Sign In before Submit
                    </SignInButton>
                </Button>
            ) : (
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            )}
        </form>
    );
};

export default FormUi;
