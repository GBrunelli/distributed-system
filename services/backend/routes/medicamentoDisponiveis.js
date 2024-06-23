const express = require("express");

module.exports = (pgClient, producer) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await pgClient.query(
                "SELECT * FROM medicamento_disponivel"
            );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar medicamentos disponíveis");
        }
    });

    router.post("/", async (req, res) => {
        const { id_ponto, id_medicamento, quantidade_disponivel } = req.body;
        try {
            const result = await pgClient.query(
                "INSERT INTO medicamento_disponivel (id_ponto, id_medicamento, quantidade_disponivel) VALUES ($1, $2, $3) RETURNING *",
                [id_ponto, id_medicamento, quantidade_disponivel]
            );
            const newMedicamentoDisponivel = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${newMedicamentoDisponivel.id_disponibilidade}`,
            //             value: JSON.stringify(newMedicamentoDisponivel),
            //         },
            //     ],
            // });

            res.status(201).json(newMedicamentoDisponivel);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao adicionar medicamento disponível");
        }
    });

    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { id_ponto, id_medicamento, quantidade_disponivel } = req.body;
        try {
            const result = await pgClient.query(
                "UPDATE medicamento_disponivel SET id_ponto = $1, id_medicamento = $2, quantidade_disponivel = $3 WHERE id_disponibilidade = $4 RETURNING *",
                [id_ponto, id_medicamento, quantidade_disponivel, id]
            );
            const updatedMedicamentoDisponivel = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${updatedMedicamentoDisponivel.id_disponibilidade}`,
            //             value: JSON.stringify(updatedMedicamentoDisponivel),
            //         },
            //     ],
            // });

            res.json(updatedMedicamentoDisponivel);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar medicamento disponível");
        }
    });

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await pgClient.query(
                "DELETE FROM medicamento_disponivel WHERE id_disponibilidade = $1",
                [id]
            );

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${id}`,
            //             value: JSON.stringify({
            //                 id_disponibilidade: id,
            //                 deleted: true,
            //             }),
            //         },
            //     ],
            // });

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao deletar medicamento disponível");
        }
    });

    return router;
};
