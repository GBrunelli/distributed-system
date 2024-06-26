import { configureStore, createSlice } from "@reduxjs/toolkit";

const medicamentosSlice = createSlice({
    name: "medicamentos",
    initialState: [],
    reducers: {
        setMedicamentos: (state, action) => action.payload,
        addMedicamento: (state, action) => [...state, action.payload],
        editMedicamento: (state, action) => {
            return state.map((medicamento) =>
                medicamento.id_medicamento === action.payload.id_medicamento
                    ? action.payload
                    : medicamento
            );
        },
        deleteMedicamento: (state, action) => {
            return state.filter(
                (medicamento) => medicamento.id_medicamento !== action.payload
            );
        },
    },
});

const medicosSlice = createSlice({
    name: "medicos",
    initialState: [],
    reducers: {
        setMedicos: (state, action) => action.payload,
        addMedico: (state, action) => [...state, action.payload],
        editMedico: (state, action) => {
            return state.map((medico) =>
                medico.id_medico === action.payload.id_medico
                    ? action.payload
                    : medico
            );
        },
        deleteMedico: (state, action) => {
            return state.filter(
                (medico) => medico.id_medico !== action.payload
            );
        },
    },
});

const pacientesSlice = createSlice({
    name: "pacientes",
    initialState: [],
    reducers: {
        setPacientes: (state, action) => action.payload,
        addPaciente: (state, action) => [...state, action.payload],
        editPaciente: (state, action) => {
            return state.map((paciente) =>
                paciente.id_paciente === action.payload.id_paciente
                    ? action.payload
                    : paciente
            );
        },
        deletePaciente: (state, action) => {
            return state.filter(
                (paciente) => paciente.id_paciente !== action.payload
            );
        },
    },
});

const pontosDistribuicaoSlice = createSlice({
    name: "pontosDistribuicao",
    initialState: [],
    reducers: {
        setPontosDistribuicao: (state, action) => action.payload,
        addPontoDistribuicao: (state, action) => [...state, action.payload],
        editPontoDistribuicao: (state, action) => {
            return state.map((ponto) =>
                ponto.id_ponto === action.payload.id_ponto
                    ? action.payload
                    : ponto
            );
        },
        deletePontoDistribuicao: (state, action) => {
            return state.filter((ponto) => ponto.id_ponto !== action.payload);
        },
    },
});

export const {
    setMedicamentos,
    addMedicamento,
    editMedicamento,
    deleteMedicamento,
} = medicamentosSlice.actions;

export const { setMedicos, addMedico, editMedico, deleteMedico } =
    medicosSlice.actions;

export const { setPacientes, addPaciente, editPaciente, deletePaciente } =
    pacientesSlice.actions;

export const {
    setPontosDistribuicao,
    addPontoDistribuicao,
    editPontoDistribuicao,
    deletePontoDistribuicao,
} = pontosDistribuicaoSlice.actions;

const store = configureStore({
    reducer: {
        medicamentos: medicamentosSlice.reducer,
        medicos: medicosSlice.reducer,
        pacientes: pacientesSlice.reducer,
        pontosDistribuicao: pontosDistribuicaoSlice.reducer,
    },
});

export default store;
