import React from "react";
import AppSidebar from "../components/AppSidebar/AppSidebar";
import Header from "../components/Header/Header";

export default function TemplatePage({ children, title, icon }) {
    return (
        <div className="flex w-screen h-screen">
            <div className="h-full">
                <AppSidebar />
            </div>
            <div className="w-screen">
                <Header title={title} icon={icon} />
                {children}
            </div>
        </div>
    );
}
