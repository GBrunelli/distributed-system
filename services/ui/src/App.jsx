import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Medicos from "./pages/Medicos";
import Medicamentos from "./pages/Medicamentos";
import Paciente from "./pages/Paciente";
import PontosDistribuicao from "./pages/PontosDistribuicao";
import "flowbite/dist/flowbite.css";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/medicos" element={<Medicos />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/pacientes" element={<Paciente />} />
            <Route
                path="/pontos-distribuicao"
                element={<PontosDistribuicao />}
            />
        </Routes>
    );
};

export default App;
