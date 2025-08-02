// 20250802170500-create-attributes.js

module.exports = {
  async up(db, client) {
    await db.createCollection("attributes", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "name"],
          properties: {
            title: { bsonType: "object" },
            name: { bsonType: "object" },
            variants: {
              bsonType: ["array"],
              items: {
                bsonType: "object",
                properties: {
                  name: { bsonType: ["object", "null"] },
                  status: {
                    enum: ["show", "hide"],
                  },
                },
              },
            },
            option: {
              enum: ["Dropdown", "Radio", "Checkbox"],
            },
            type: {
              enum: ["attribute", "extra"],
            },
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
    await db.collection("attributes").drop();
  },
};
