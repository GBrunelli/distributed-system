import React from "react";
import axios from "axios";
import TemplatePage from "./TemplatePage";

const nomes = [
    "Ana",
    "Bruno",
    "Carlos",
    "Diana",
    "Eduardo",
    "Fernanda",
    "Gustavo",
    "Helena",
    "Igor",
    "Julia",
];
const sobrenomes = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Rodrigues",
    "Ferreira",
    "Almeida",
    "Costa",
    "Gomes",
    "Martins",
];

const tiposPonto = [
    "Farmácia",
    "Hospital",
    "Posto de Saúde",
    "Clínica",
    "Distribuidora",
];

const generateRandomName = () => {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    return `${nome} ${sobrenome}`;
};

const generateMockData = async () => {
    const mockPacientes = [];
    const mockMedicos = [];
    const mockPontosDistribuicao = [];

    for (let i = 0; i < 20; i++) {
        await axios.post("http://localhost:8081/pacientes", {
            nome: generateRandomName(),
            cpf: `${Math.floor(Math.random() * 1000000000000)}`,
            data_nascimento: new Date(1990 + i, 0, 1)
                .toISOString()
                .split("T")[0],
            endereco: `Endereço ${i}`,
            telefone: `99999-999${i}`,
        });

        await axios.post("http://localhost:8081/medicos", {
            nome: `Dr. ${generateRandomName()}`,
            crm: `${Math.floor(Math.random() * 1000000)}`,
            especialidade: `Especialidade ${i % 5}`,
            telefone: `88888-888${i}`,
            email: `medico${i}@example.com`,
        });

        await axios.post("http://localhost:8081/pontos-distribuicao", {
            nome: `Ponto ${i}`,
            tipo: tiposPonto[i % tiposPonto.length],
            endereco: `Endereço ${i}`,
            telefone: `77777-777${i}`,
        });
    }

    alert(
        "Dados mock de pacientes, médicos e pontos de distribuição foram inseridos com sucesso!"
    );
};

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

                    <div>
                        <button
                            onClick={generateMockData}
                            className="px-4 py-2 text-white bg-blue-500 rounded"
                        >
                            Preencher Dados Mock
                        </button>
                    </div>
                </div>
            </div>
        </TemplatePage>
    );
};

export default Home;
