import { Button } from "@/components/ui/button";
import { LibraryBig, LineChart, MessagesSquare, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface MenuItem {
    id: number;
    name: string;
    icons: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    path: string;
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

    const path = usePathname();
    useEffect(() => {
        console.log(path);
    }, [path]);

    return (
        <div className="h-screen shadow-md border">
            <div className="p-5">
                {menuList.map((menu) => (
                    <h2
                        key={menu.id}
                        className={`flex items-center gap-3 p-4 mb-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer text-gray-900 ${
                            path == menu.path && "bg-primary text-white"
                        }`}
                    >
                        <menu.icons />
                        {menu.name}
                    </h2>
                ))}
            </div>
            <div className="fixed bottom-8 p-6 w-64">
                <Button className="w-full">+ Create Form</Button>
                <div className="mt-7">
                    <Progress value={33} />
                    <h2 className="text-sm mt-2 text-gray-600">
                        <strong>2 </strong>
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
