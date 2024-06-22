const express = require("express");

module.exports = (pgClient, producer) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await pgClient.query(
                "SELECT * FROM prescricao_medicamento"
            );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar prescrição de medicamentos");
        }
    });

    router.post("/", async (req, res) => {
        const {
            id_prescricao,
            id_medicamento,
            quantidade_prescrita,
            posologia,
        } = req.body;
        try {
            const result = await pgClient.query(
                "INSERT INTO prescricao_medicamento (id_prescricao, id_medicamento, quantidade_prescrita, posologia) VALUES ($1, $2, $3, $4) RETURNING *",
                [id_prescricao, id_medicamento, quantidade_prescrita, posologia]
            );
            const newPrescricaoMedicamento = result.rows[0];

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${newPrescricaoMedicamento.id_prescricao}-${newPrescricaoMedicamento.id_medicamento}`,
                        value: JSON.stringify(newPrescricaoMedicamento),
                    },
                ],
            });

            res.status(201).json(newPrescricaoMedicamento);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao adicionar prescrição de medicamento");
        }
    });

    router.put("/:id_prescricao/:id_medicamento", async (req, res) => {
        const { id_prescricao, id_medicamento } = req.params;
        const { quantidade_prescrita, posologia } = req.body;
        try {
            const result = await pgClient.query(
                "UPDATE prescricao_medicamento SET quantidade_prescrita = $1, posologia = $2 WHERE id_prescricao = $3 AND id_medicamento = $4 RETURNING *",
                [quantidade_prescrita, posologia, id_prescricao, id_medicamento]
            );
            const updatedPrescricaoMedicamento = result.rows[0];

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${updatedPrescricaoMedicamento.id_prescricao}-${updatedPrescricaoMedicamento.id_medicamento}`,
                        value: JSON.stringify(updatedPrescricaoMedicamento),
                    },
                ],
            });

            res.json(updatedPrescricaoMedicamento);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar prescrição de medicamento");
        }
    });

    router.delete("/:id_prescricao/:id_medicamento", async (req, res) => {
        const { id_prescricao, id_medicamento } = req.params;
        try {
            await pgClient.query(
                "DELETE FROM prescricao_medicamento WHERE id_prescricao = $1 AND id_medicamento = $2",
                [id_prescricao, id_medicamento]
            );

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${id_prescricao}-${id_medicamento}`,
                        value: JSON.stringify({
                            id_prescricao,
                            id_medicamento,
                            deleted: true,
                        }),
                    },
                ],
            });

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao deletar prescrição de medicamento");
        }
    });

    return router;
};
