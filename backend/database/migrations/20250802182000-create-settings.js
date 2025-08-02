module.exports = {
    async up(db, client) {
        await db.createCollection("settings", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            bsonType: "string",
                            description: "Name of the setting is required",
                        },
                        setting: {}, // open schema
                        createdAt: { bsonType: "date" },
                        updatedAt: { bsonType: "date" },
                    },
                },
            },
        });

        await db.collection("settings").createIndex({ name: 1 }, { unique: true });
    },

    async down(db, client) {
        await db.collection("settings").drop();
    }
};
