// 20250802174000-create-holidays.js

module.exports = {
  async up(db, client) {
    await db.createCollection("holidays", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["date", "name"],
          properties: {
            date: { bsonType: "date" },
            name: { bsonType: "string" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });

    // Add unique index on `date`
    await db.collection("holidays").createIndex({ date: 1 }, { unique: true });
  },

  async down(db, client) {
    await db.collection("holidays").drop();
  },
};
