import { Button } from "@/components/ui/button";
import { LibraryBig, LineChart, MessagesSquare, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

interface MenuItem {
    id: number;
    name: string;
    icons: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    path: string;
}

interface Form {
    id: number;
    style: string | null;
    jsonform: string | null;
    theme: string;
    background: string | null;
    createdBy: string;
    createdAt: string;
}
function SideNav() {
    const menuList: MenuItem[] = [
        { id: 1, name: "MyForms", icons: LibraryBig, path: "/dashboard" },
        {
            id: 2,
            name: "Responses",
            icons: MessagesSquare,
            path: "/dashboard/responses",
        },
        {
            id: 3,
            name: "Analytics",
            icons: LineChart,
            path: "/dashboard/analytics",
        },
        { id: 4, name: "Upgrade", icons: Shield, path: "/dashboard/upgrade" },
    ];

    const { user } = useUser();
    const path = usePathname();

    const [formList, setFormList] = useState<Form[]>([]);
    const [PercFileCreated, setPercFileCreated] = useState(0);

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
        
        const perc = (result.length / 3) * 100;
        setPercFileCreated(perc);
    };

    return (
        <div className="h-screen shadow-md border">
            <div className="p-5">
                {menuList.map((menu) => (
                    <Link
                        href={menu.path}
                        key={menu.id}
                        className={`flex items-center gap-3 p-4 mb-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer text-gray-900 ${
                            path == menu.path && "bg-primary text-white"
                        }`}
                    >
                        <menu.icons />
                        {menu.name}
                    </Link>
                ))}
            </div>
            <div className="fixed bottom-8 p-6 w-64">
                <Button className="w-full">+ Create Form</Button>
                <div className="mt-7">
                    <Progress value={PercFileCreated} />
                    <h2 className="text-sm mt-2 text-gray-600">
                        <strong>{formList?.length} </strong>
                        Out of
                        <strong>3 </strong>
                        form created
                    </h2>
                    <h2 className="text-sm mt-3 text-gray-600">
                        Upgrade Your Plan For unlimited AI Form Build
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default SideNav;
