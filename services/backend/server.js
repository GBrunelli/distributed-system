const express = require("express");
const { Client } = require("pg");
const { Kafka } = require("kafkajs");

const pacientesRoutes = require("./routes/pacientes");
const medicosRoutes = require("./routes/medicos");
const prescricoesRoutes = require("./routes/prescricoes");
const medicamentosRoutes = require("./routes/medicamentos");
const fabricantesRoutes = require("./routes/fabricantes");
const pontosDistribuicaoRoutes = require("./routes/pontosDistribuicao");
const prescricaoMedicamentosRoutes = require("./routes/prescricaoMedicamentos");
const medicamentoDisponiveisRoutes = require("./routes/medicamentoDisponiveis");

const app = express();
const port = 5000;

const pgClient = new Client({
    user: "postgres",
    host: "localhost",
    database: "distribuidos",
    password: "helloworld",
    port: 5432,
});

pgClient
    .connect()
    .then(() => console.log("Conectado ao PostgreSQL"))
    .catch((err) => console.error("Erro ao conectar ao PostgreSQL", err));

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "my-group" });

const runKafka = async () => {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
        topic: "fila-requisicoes",
        fromBeginning: true,
    });

    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
};

runKafka().catch(console.error);

app.use(express.json());

app.use("/pacientes", pacientesRoutes(pgClient, producer));
app.use("/medicos", medicosRoutes(pgClient, producer));
app.use("/prescricoes", prescricoesRoutes(pgClient, producer));
app.use("/medicamentos", medicamentosRoutes(pgClient, producer));
app.use("/fabricantes", fabricantesRoutes(pgClient, producer));
app.use("/pontos-distribuicao", pontosDistribuicaoRoutes(pgClient, producer));
app.use(
    "/prescricao-medicamentos",
    prescricaoMedicamentosRoutes(pgClient, producer)
);
app.use(
    "/medicamento-disponiveis",
    medicamentoDisponiveisRoutes(pgClient, producer)
);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
