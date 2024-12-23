// components/SideNav.tsx
import { Button } from "@/components/ui/button";
import { LibraryBig, LineChart, MessagesSquare, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

// Types
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
    const menuList: MenuItem[] = React.useMemo(() => [
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
    ], []);

    const { user } = useUser();
    const path = usePathname();
    const [formList, setFormList] = React.useState<Form[]>([]);
    const [percFileCreated, setPercFileCreated] = React.useState(0);

    const getFormList = useCallback(async () => {
        if (!user?.primaryEmailAddress?.emailAddress) return;
        
        try {
            const result = await db
                .select()
                .from(JsonForms)
                .where(
                    eq(
                        JsonForms.createdBy,
                        user.primaryEmailAddress.emailAddress
                    )
                )
                .orderBy(desc(JsonForms.id));
                
            setFormList(result);
            const perc = (result.length / 3) * 100;
            setPercFileCreated(Math.min(perc, 100));
        } catch (error) {
            console.error('Error fetching form list:', error);
            // Here you might want to add error handling UI
        }
    }, [user?.primaryEmailAddress?.emailAddress]);

    React.useEffect(() => {
        if (user) {
            getFormList();
        }
    }, [user, getFormList]);

    const handleCreateForm = () => {
        // Implement form creation logic here
        console.log('Create form clicked');
    };

    return (
        <aside className="h-screen border shadow-md">
            <nav className="p-5">
                {menuList.map((menu) => (
                    <Link
                        href={menu.path}
                        key={menu.id}
                        className={`flex items-center gap-3 p-4 mb-3 rounded-lg cursor-pointer text-gray-900 hover:bg-primary hover:text-white transition-colors ${
                            path === menu.path ? "bg-primary text-white" : ""
                        }`}
                    >
                        <menu.icons aria-hidden="true" />
                        <span>{menu.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="fixed bottom-8 p-6 w-64">
                <Button 
                    onClick={handleCreateForm}
                    className="w-full"
                >
                    + Create Form
                </Button>

                <div className="mt-7">
                    <Progress 
                        value={percFileCreated} 
                        className="h-2"
                        aria-label="Form creation progress"
                    />
                    <h2 className="mt-2 text-sm text-gray-600">
                        <strong>{formList.length} </strong>
                        out of
                        <strong> 3 </strong>
                        forms created
                    </h2>
                    <p className="mt-3 text-sm text-gray-600">
                        Upgrade your plan for unlimited AI form building
                    </p>
                </div>
            </div>
        </aside>
    );
}

export default SideNav;