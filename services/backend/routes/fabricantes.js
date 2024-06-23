const express = require("express");

module.exports = (pgClient, producer) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await pgClient.query("SELECT * FROM fabricante");
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar fabricantes");
        }
    });

    router.post("/", async (req, res) => {
        const { nome, cnpj, endereco, telefone } = req.body;
        try {
            const result = await pgClient.query(
                "INSERT INTO fabricante (nome, cnpj, endereco, telefone) VALUES ($1, $2, $3, $4) RETURNING *",
                [nome, cnpj, endereco, telefone]
            );
            const newFabricante = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${newFabricante.id_fabricante}`,
            //             value: JSON.stringify(newFabricante),
            //         },
            //     ],
            // });

            res.status(201).json(newFabricante);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao adicionar fabricante");
        }
    });

    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const { nome, cnpj, endereco, telefone } = req.body;
        try {
            const result = await pgClient.query(
                "UPDATE fabricante SET nome = $1, cnpj = $2, endereco = $3, telefone = $4 WHERE id_fabricante = $5 RETURNING *",
                [nome, cnpj, endereco, telefone, id]
            );
            const updatedFabricante = result.rows[0];

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${updatedFabricante.id_fabricante}`,
            //             value: JSON.stringify(updatedFabricante),
            //         },
            //     ],
            // });

            res.json(updatedFabricante);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao atualizar fabricante");
        }
    });

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        try {
            await pgClient.query(
                "DELETE FROM fabricante WHERE id_fabricante = $1",
                [id]
            );

            // Enviar mensagem para Kafka
            // await producer.send({
            //     topic: "fila-requisicoes",
            //     messages: [
            //         {
            //             key: `${id}`,
            //             value: JSON.stringify({
            //                 id_fabricante: id,
            //                 deleted: true,
            //             }),
            //         },
            //     ],
            // });

            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao deletar fabricante");
        }
    });

    return router;
};
