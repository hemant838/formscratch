"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
    const { isSignedIn } = useUser();
    const path = usePathname();
    useEffect(() => {
        console.log(path);
    }, []);

    return (
        !path.includes("aiform") && (
            <div className="p-5 border-b shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="text-bold text-3xl text-blue-600">
                        FormScratch
                    </div>
                    {isSignedIn ? (
                        <div className="flex items-center gap-5">
                            <Link href={"/dashboard"}>
                                <Button variant="outline">Dashboard</Button>
                            </Link>
                            <UserButton />
                        </div>
                    ) : (
                        <SignInButton>
                            <Button>Get Started</Button>
                        </SignInButton>
                    )}
                </div>
            </div>
        )
    );
}

export default Header;
