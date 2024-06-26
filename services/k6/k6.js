import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

export let errorRate = new Rate("errors");

export let options = {
    vus: 100,
    duration: "20s",
    thresholds: {
        errors: ["rate<0.01"], // <1% errors
    },
};

export default function () {
    // Teste de CRUD para o endpoint /medicos
    let medicoData = {
        nome: `Dr. ${__VU}`,
        crm: `CRM-${__VU}`,
        especialidade: "Cardiologia",
        telefone: "1234567890",
        email: `dr${__VU}@example.com`,
    };

    let medicoPostRes = http.post(
        "http://localhost:8081/medicos",
        JSON.stringify(medicoData),
        { headers: { "Content-Type": "application/json" } }
    );
    console.log(`Response from /medicos POST: ${medicoPostRes.body}`);
    check(medicoPostRes, { "status was 200": (r) => r.status == 200 }) ||
        errorRate.add(1);
    if (medicoPostRes.status == 200) {
        let medicoId;
        try {
            medicoId = JSON.parse(medicoPostRes.body).id_medico;
        } catch (e) {
            console.error(`Failed to parse /medicos POST response: ${e}`);
            errorRate.add(1);
        }
        if (medicoId) {
            let medicoDelRes = http.del(
                `http://localhost:8081/medicos/${medicoId}`
            );
            check(medicoDelRes, { "status was 200": (r) => r.status == 200 }) ||
                errorRate.add(1);
        }
    }

    // Teste de CRUD para o endpoint /pacientes
    let pacienteData = {
        nome: `Paciente ${__VU}`,
        cpf: `000.000.000-${__VU}`,
        data_nascimento: "2000-01-01",
        endereco: "Rua A, 123",
        telefone: "0987654321",
    };

    let pacientePostRes = http.post(
        "http://localhost:8081/pacientes",
        JSON.stringify(pacienteData),
        { headers: { "Content-Type": "application/json" } }
    );
    console.log(`Response from /pacientes POST: ${pacientePostRes.body}`);
    check(pacientePostRes, { "status was 200": (r) => r.status == 200 }) ||
        errorRate.add(1);
    if (pacientePostRes.status == 200) {
        let pacienteId;
        try {
            pacienteId = JSON.parse(pacientePostRes.body).id_paciente;
        } catch (e) {
            console.error(`Failed to parse /pacientes POST response: ${e}`);
            errorRate.add(1);
        }
        if (pacienteId) {
            let pacienteDelRes = http.del(
                `http://localhost:8081/pacientes/${pacienteId}`
            );
            check(pacienteDelRes, {
                "status was 200": (r) => r.status == 200,
            }) || errorRate.add(1);
        }
    }

    // Teste de CRUD para o endpoint /medicamentos
    let medicamentoData = {
        nome: `New Medicamento ${__VU}`,
        descricao: "Description of the Medicamento",
        fabricante_id: 1,
        data_registro_anvisa: "2024-12-31",
        codigo_anvisa: "1234567890123",
        codigo_ggrem: "9876543210987",
        classe_terapeutica: "Classe A",
        ean1: "1234567890123",
        ean2: "2345678901234",
        ean3: "3456789012345",
        status_produto: "Ativo",
        regime_preco: "Regime A",
        preco_minimo: 10.0,
        preco_maximo: 20.0,
        restricao_hospitalar: "Nenhuma",
        tarja: "Vermelha",
        destinacao_comercial: "Comercial",
    };

    let medicamentoPostRes = http.post(
        "http://localhost:8081/medicamentos",
        JSON.stringify(medicamentoData),
        { headers: { "Content-Type": "application/json" } }
    );
    console.log(`Response from /medicamentos POST: ${medicamentoPostRes.body}`);
    check(medicamentoPostRes, { "status was 200": (r) => r.status == 200 }) ||
        errorRate.add(1);
    if (medicamentoPostRes.status == 200) {
        let medicamentoId;
        try {
            medicamentoId = JSON.parse(medicamentoPostRes.body).id_medicamento;
        } catch (e) {
            console.error(`Failed to parse /medicamentos POST response: ${e}`);
            errorRate.add(1);
        }
        if (medicamentoId) {
            let medicamentoDelRes = http.del(
                `http://localhost:8081/medicamentos/${medicamentoId}`
            );
            check(medicamentoDelRes, {
                "status was 200": (r) => r.status == 200,
            }) || errorRate.add(1);
        }
    }

    // Teste de CRUD para o endpoint /pontosdistribuicao
    let pontoDistribuicaoData = {
        nome: `Ponto Distribuição ${__VU}`,
        endereco: "Rua B, 456",
        telefone: "1122334455",
        tipo: "Hospital",
    };

    let pontoDistribuicaoPostRes = http.post(
        "http://localhost:8081/pontos-distribuicao",
        JSON.stringify(pontoDistribuicaoData),
        { headers: { "Content-Type": "application/json" } }
    );
    console.log(
        `Response from /pontosdistribuicao POST: ${pontoDistribuicaoPostRes.body}`
    );
    check(pontoDistribuicaoPostRes, {
        "status was 200": (r) => r.status == 200,
    }) || errorRate.add(1);
    if (pontoDistribuicaoPostRes.status == 200) {
        let pontoDistribuicaoId;
        try {
            pontoDistribuicaoId = JSON.parse(
                pontoDistribuicaoPostRes.body
            ).id_ponto;
        } catch (e) {
            console.error(
                `Failed to parse /pontosdistribuicao POST response: ${e}`
            );
            errorRate.add(1);
        }
        if (pontoDistribuicaoId) {
            let pontoDistribuicaoDelRes = http.del(
                `http://localhost:8081/pontosdistribuicao/${pontoDistribuicaoId}`
            );
            check(pontoDistribuicaoDelRes, {
                "status was 200": (r) => r.status == 200,
            }) || errorRate.add(1);
        }
    }
}
