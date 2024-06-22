const express = require("express");

module.exports = (pgClient, producer) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await pgClient.query(
                "SELECT * FROM ponto_distribuicao"
            );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar pontos de distribuição");
        }
    });

    router.post("/", async (req, res) => {
        const { nome, tipo, endereco, telefone } = req.body;
        try {
            const result = await pgClient.query(
                "INSERT INTO ponto_distribuicao (nome, tipo, endereco, telefone) VALUES ($1, $2, $3, $4) RETURNING *",
                [nome, tipo, endereco, telefone]
            );
            const newPontoDistribuicao = result.rows[0];

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${newPontoDistribuicao.id_ponto}`,
                        value: JSON.stringify(newPontoDistribuicao),
                    },
                ],
            });

            res.status(201).json(newPontoDistribuicao);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao adicionar ponto de distribuição");
        }
    });

    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { nome, tipo, endereco, telefone } = req.body;
        try {
            const result = await pgClient.query(
                "UPDATE ponto_distribuicao SET nome = $1, tipo = $2, endereco = $3, telefone = $4 WHERE id_ponto = $5 RETURNING *",
                [nome, tipo, endereco, telefone, id]
            );
            const updatedPontoDistribuicao = result.rows[0];

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${updatedPontoDistribuicao.id_ponto}`,
                        value: JSON.stringify(updatedPontoDistribuicao),
                    },
                ],
            });

            res.json(updatedPontoDistribuicao);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar ponto de distribuição");
        }
    });

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await pgClient.query(
                "DELETE FROM ponto_distribuicao WHERE id_ponto = $1",
                [id]
            );

            // Enviar mensagem para Kafka
            await producer.send({
                topic: "fila-requisicoes",
                messages: [
                    {
                        key: `${id}`,
                        value: JSON.stringify({ id_ponto: id, deleted: true }),
                    },
                ],
            });

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao deletar ponto de distribuição");
        }
    });

    return router;
};
