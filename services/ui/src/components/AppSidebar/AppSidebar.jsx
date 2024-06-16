import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    HiHome,
    HiClipboardList,
    HiUserGroup,
    HiCollection,
    HiOfficeBuilding,
} from "react-icons/hi";
import { Sidebar } from "flowbite-react";

const SidebarItem = ({ to, icon: Icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Sidebar.Item
            as={Link}
            to={to}
            icon={Icon}
            className={isActive ? "bg-gray-200 hover:bg-gray-200" : ""}
        >
            {children}
        </Sidebar.Item>
    );
};

function AppSidebar() {
    return (
        <Sidebar aria-label="Default sidebar example">
            <Sidebar.Logo>
                <Link to="/">
                    <img
                        src="/assets/Horizontal.png"
                        alt="Logo"
                        className="w-40"
                    />
                </Link>
            </Sidebar.Logo>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <SidebarItem to="/" icon={HiHome}>
                        Home
                    </SidebarItem>
                    <SidebarItem to="/prescricoes" icon={HiClipboardList}>
                        Prescrições
                    </SidebarItem>
                    <SidebarItem to="/medicos" icon={HiUserGroup}>
                        Médicos
                    </SidebarItem>
                    <SidebarItem to="/medicamentos" icon={HiCollection}>
                        Medicamentos
                    </SidebarItem>
                    <SidebarItem
                        to="/pontos-distribuicao"
                        icon={HiOfficeBuilding}
                    >
                        Pontos de Distribuição
                    </SidebarItem>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default AppSidebar;
