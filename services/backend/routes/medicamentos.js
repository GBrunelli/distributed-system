const express = require("express");

module.exports = (pgClient, producer) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;

        try {
            const result = await pgClient.query(
                "SELECT * FROM medicamento ORDER BY id_medicamento LIMIT $1 OFFSET $2",
                [limit, offset]
            );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar medicamentos");
        }
    });

    router.post("/", async (req, res) => {
        const {
            nome,
            descricao,
            fabricante_id,
            data_registro_anvisa,
            codigo_anvisa,
            codigo_ggrem,
            classe_terapeutica,
            ean1,
            ean2,
            ean3,
            status_produto,
            regime_preco,
            preco_minimo,
            preco_maximo,
            restricao_hospitalar,
            tarja,
            destinacao_comercial,
        } = req.body;
        try {
            const result = await pgClient.query(
                `INSERT INTO medicamento (nome, descricao, fabricante_id, data_registro_anvisa, codigo_anvisa, codigo_ggrem, classe_terapeutica, ean1, ean2, ean3, status_produto, regime_preco, preco_minimo, preco_maximo, restricao_hospitalar, tarja, destinacao_comercial) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
                [
                    nome,
                    descricao,
                    fabricante_id,
                    data_registro_anvisa,
                    codigo_anvisa,
                    codigo_ggrem,
                    classe_terapeutica,
                    ean1,
                    ean2,
                    ean3,
                    status_produto,
                    regime_preco,
                    preco_minimo,
                    preco_maximo,
                    restricao_hospitalar,
                    tarja,
                    destinacao_comercial,
                ]
            );
            const newMedicamento = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${newMedicamento.id_medicamento}`,
            //             value: JSON.stringify(newMedicamento),
            //         },
            //     ],
            // });

            res.status(201).json(newMedicamento);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao adicionar medicamento");
        }
    });

    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const {
            nome,
            descricao,
            fabricante_id,
            data_registro_anvisa,
            codigo_anvisa,
            codigo_ggrem,
            classe_terapeutica,
            ean1,
            ean2,
            ean3,
            status_produto,
            regime_preco,
            preco_minimo,
            preco_maximo,
            restricao_hospitalar,
            tarja,
            destinacao_comercial,
        } = req.body;
        try {
            const result = await pgClient.query(
                `UPDATE medicamento SET nome = $1, descricao = $2, fabricante_id = $3, data_registro_anvisa = $4, codigo_anvisa = $5, codigo_ggrem = $6, classe_terapeutica = $7, ean1 = $8, ean2 = $9, ean3 = $10, status_produto = $11, regime_preco = $12, preco_minimo = $13, preco_maximo = $14, restricao_hospitalar = $15, tarja = $16, destinacao_comercial = $17 WHERE id_medicamento = $18 RETURNING *`,
                [
                    nome,
                    descricao,
                    fabricante_id,
                    data_registro_anvisa,
                    codigo_anvisa,
                    codigo_ggrem,
                    classe_terapeutica,
                    ean1,
                    ean2,
                    ean3,
                    status_produto,
                    regime_preco,
                    preco_minimo,
                    preco_maximo,
                    restricao_hospitalar,
                    tarja,
                    destinacao_comercial,
                    id,
                ]
            );
            const updatedMedicamento = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${updatedMedicamento.id_medicamento}`,
            //             value: JSON.stringify(updatedMedicamento),
            //         },
            //     ],
            // });

            res.json(updatedMedicamento);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar medicamento");
        }
    });

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await pgClient.query(
                "DELETE FROM medicamento WHERE id_medicamento = $1",
                [id]
            );

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${id}`,
            //             value: JSON.stringify({
            //                 id_medicamento: id,
            //                 deleted: true,
            //             }),
            //         },
            //     ],
            // });

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao deletar medicamento");
        }
    });

    return router;
};
