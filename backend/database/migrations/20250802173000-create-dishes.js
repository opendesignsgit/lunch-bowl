// 20250802173000-create-dishes.js

module.exports = {
  async up(db, client) {
    await db.createCollection("dishes", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "primaryDishTitle",
            "shortDescription",
            "description",
            "image",
            "cuisine",
            "status",
            "ingredients",
            "nutritionValues",
          ],
          properties: {
            primaryDishTitle: { bsonType: "string" },
            subDishTitle: { bsonType: ["string", "null"] },
            shortDescription: { bsonType: "string" },
            description: { bsonType: "string" },
            image: { bsonType: "string" },
            dishImage2: { bsonType: ["string", "null"] },
            cuisine: { bsonType: "string" },
            status: { enum: ["active", "inactive"] },
            ingredients: {
              bsonType: "array",
              items: { bsonType: "string" },
              minItems: 1,
            },
            nutritionValues: {
              bsonType: "array",
              items: { bsonType: "string" },
              minItems: 1,
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });
  },

  async down(db, client) {
    await db.collection("dishes").drop();
  },
};
