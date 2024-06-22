import React from "react";
import Header from "../components/Header/Header";
import ItemsTable from "../components/ItemsTable/ItemsTable";
import { Link } from "react-router-dom";
import TemplatePage from "./TemplatePage";

const Home = () => {
    return (
        <TemplatePage>
            <div className="flex flex-col w-full gap-16 py-8 text-center px-14 max-w-9xl">
                <h2>
                    Use a barra de navegação lateral para acessar todos os
                    recursos
                </h2>

                <div className="flex flex-col items-center justify-center gap-12">
                    <div>
                        <img src="/assets/Vertical.png" alt="" />
                    </div>

                    <div>
                        <h3>Integrantes do grupo</h3>
                        <ul>
                            <li>Gustavo Henrique Brunelli - 11801053</li>
                            <li>Paulo Henrique de Souza Soares - 11884713</li>
                            <li>Vitor Caetano Brustolin - 11795589</li>
                            <li>Rafael Corona - 4769989</li>
                        </ul>
                    </div>
                </div>
            </div>
        </TemplatePage>
    );
};

export default Home;
