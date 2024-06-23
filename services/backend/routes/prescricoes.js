const express = require("express");

module.exports = (pgClient, producer) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await pgClient.query("SELECT * FROM prescricao");
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar prescrições");
        }
    });

    router.post("/", async (req, res) => {
        const { paciente_id, medico_id, data_prescricao } = req.body;
        try {
            const result = await pgClient.query(
                "INSERT INTO prescricao (id_paciente, id_medico, data_prescricao) VALUES ($1, $2, $3) RETURNING *",
                [paciente_id, medico_id, data_prescricao]
            );
            const newPrescricao = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${newPrescricao.id_prescricao}`,
            //             value: JSON.stringify(newPrescricao),
            //         },
            //     ],
            // });

            res.status(201).json(newPrescricao);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao adicionar prescrição");
        }
    });

    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { paciente_id, medico_id, data_prescricao } = req.body;
        try {
            const result = await pgClient.query(
                "UPDATE prescricao SET id_paciente = $1, id_medico = $2, data_prescricao = $3 WHERE id_prescricao = $4 RETURNING *",
                [paciente_id, medico_id, data_prescricao, id]
            );
            const updatedPrescricao = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${updatedPrescricao.id_prescricao}`,
            //             value: JSON.stringify(updatedPrescricao),
            //         },
            //     ],
            // });

            res.json(updatedPrescricao);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar prescrição");
        }
    });

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await pgClient.query(
                "DELETE FROM prescricao WHERE id_prescricao = $1",
                [id]
            );

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${id}`,
            //             value: JSON.stringify({
            //                 id_prescricao: id,
            //                 deleted: true,
            //             }),
            //         },
            //     ],
            // });

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao deletar prescrição");
        }
    });

    return router;
};
