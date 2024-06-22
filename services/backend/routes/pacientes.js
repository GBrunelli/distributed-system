const express = require("express");

module.exports = (pgClient, producer) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await pgClient.query("SELECT * FROM paciente");
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar pacientes");
        }
    });

    router.post("/", async (req, res) => {
        const { nome, cpf, data_nascimento, endereco, telefone } = req.body;
        try {
            const result = await pgClient.query(
                "INSERT INTO paciente (nome, cpf, data_nascimento, endereco, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [nome, cpf, data_nascimento, endereco, telefone]
            );
            const newPaciente = result.rows[0];

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${newPaciente.id_paciente}`,
                        value: JSON.stringify(newPaciente),
                    },
                ],
            });

            res.status(201).json(newPaciente);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao adicionar paciente");
        }
    });

    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { nome, cpf, data_nascimento, endereco, telefone } = req.body;
        try {
            const result = await pgClient.query(
                "UPDATE paciente SET nome = $1, cpf = $2, data_nascimento = $3, endereco = $4, telefone = $5 WHERE id_paciente = $6 RETURNING *",
                [nome, cpf, data_nascimento, endereco, telefone, id]
            );
            const updatedPaciente = result.rows[0];

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${updatedPaciente.id_paciente}`,
                        value: JSON.stringify(updatedPaciente),
                    },
                ],
            });

            res.json(updatedPaciente);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar paciente");
        }
    });

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await pgClient.query(
                "DELETE FROM paciente WHERE id_paciente = $1",
                [id]
            );

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${id}`,
                        value: JSON.stringify({
                            id_paciente: id,
                            deleted: true,
                        }),
                    },
                ],
            });

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao deletar paciente");
        }
    });

    return router;
};
