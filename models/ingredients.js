class IngredientModel {
    async addIngredient(connection, payload) {
        await connection.execute(`INSERT INTO ingredients
            (name, description) VALUES (?,?)
        `,[payload.name, payload.description]);

        return true;
    }
}

module.exports = new IngredientModel();