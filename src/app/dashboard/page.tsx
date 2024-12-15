import React from "react";
import FormGenerator from "../form-generator";
import FormList from "./_components/FormList";

function Dashboard() {
    return (
        <div className="p-10">
            <div className="flex justify-between space-y-4 ">
                <h2 className="text-3xl font-bold mt-5">DashBoard</h2>
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
