import React from "react";

const Header = ({ title, icon }) => {
    return (
        <header className="shadow">
            <div className="py-6 mx-auto max-w-9xl sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <div className="text-2xl">{icon}</div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {title}
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
