// 20250802172000-create-currencies.js

module.exports = {
  async up(db, client) {
    await db.createCollection("currencies", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name"],
          properties: {
            name: { bsonType: "string" },
            symbol: { bsonType: ["string", "null"] },
            status: {
              enum: ["show", "hide"],
            },
            live_exchange_rates: {
              enum: ["show", "hide"],
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });
  },

  async down(db, client) {
    await db.collection("currencies").drop();
  },
};
