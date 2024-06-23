const express = require("express");

module.exports = (pgClient, producer) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await pgClient.query("SELECT * FROM medico");
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar médicos");
        }
    });

    router.post("/", async (req, res) => {
        const { nome, crm, especialidade, telefone, email } = req.body;
        try {
            const result = await pgClient.query(
                "INSERT INTO medico (nome, crm, especialidade, telefone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [nome, crm, especialidade, telefone, email]
            );
            const newMedico = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${newMedico.id_medico}`,
            //             value: JSON.stringify(newMedico),
            //         },
            //     ],
            // });

            res.status(201).json(newMedico);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao adicionar médico");
        }
    });

    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { nome, crm, especialidade, telefone, email } = req.body;
        try {
            const result = await pgClient.query(
                "UPDATE medico SET nome = $1, crm = $2, especialidade = $3, telefone = $4, email = $5 WHERE id_medico = $6 RETURNING *",
                [nome, crm, especialidade, telefone, email, id]
            );
            const updatedMedico = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${updatedMedico.id_medico}`,
            //             value: JSON.stringify(updatedMedico),
            //         },
            //     ],
            // });

            res.json(updatedMedico);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar médico");
        }
    });

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await pgClient.query("DELETE FROM medico WHERE id_medico = $1", [
                id,
            ]);

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${id}`,
            //             value: JSON.stringify({ id_medico: id, deleted: true }),
            //         },
            //     ],
            // });

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao deletar médico");
        }
    });

    return router;
};
