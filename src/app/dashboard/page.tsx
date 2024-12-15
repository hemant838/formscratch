import React from "react";
import FormGenerator from "../form-generator";
import FormList from "./_components/FormList";

function Dashboard() {
    return (
        <div className="p-10">
            <div className="flex justify-between space-y-4 ">
                <div className="text-3xl font-bold mt-5">DashBoard</div>
                <div>
                    <FormGenerator />
                </div>
            </div>

            {/* list of Form */}
            <FormList />
        </div>
    );
}

export default Dashboard;
