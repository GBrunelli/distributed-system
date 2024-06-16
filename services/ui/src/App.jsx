import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Prescricoes from "./pages/Prescricoes";
import Medicos from "./pages/Medicos";
import Medicamentos from "./pages/Medicamentos";
import PontosDistribuicao from "./pages/PontosDistribuicao";
import "flowbite/dist/flowbite.css";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/prescricoes" element={<Prescricoes />} />
                <Route path="/medicos" element={<Medicos />} />
                <Route path="/medicamentos" element={<Medicamentos />} />
                <Route
                    path="/pontos-distribuicao"
                    element={<PontosDistribuicao />}
                />
            </Routes>
        </div>
    );
};

export default App;
