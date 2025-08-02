// 20250802171000-create-categories.js

module.exports = {
  async up(db, client) {
    await db.createCollection("categories", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name"],
          properties: {
            name: { bsonType: "object" },
            description: { bsonType: ["object", "null"] },
            slug: { bsonType: ["string", "null"] },
            parentId: { bsonType: ["string", "null"] },
            parentName: { bsonType: ["string", "null"] },
            id: { bsonType: ["string", "null"] },
            icon: { bsonType: ["string", "null"] },
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
    await db.collection("categories").drop();
  },
};
