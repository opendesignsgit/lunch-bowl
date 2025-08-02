// 20250802174500-create-languages.js

module.exports = {
  async up(db, client) {
    await db.createCollection("languages", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "iso_code"],
          properties: {
            name: { bsonType: "string" },
            iso_code: { bsonType: "string" },
            flag: { bsonType: ["string", "null"] },
            status: {
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
    await db.collection("languages").drop();
  },
};
