// 20250802182500-create-usermeals.js

module.exports = {
  async up(db, client) {
    await db.createCollection("usermeals", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId"],
          properties: {
            userId: { bsonType: "objectId" },
            children: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["childId"],
                properties: {
                  childId: { bsonType: "objectId" },
                  meals: {
                    bsonType: "array",
                    items: {
                      bsonType: "object",
                      required: ["mealDate", "mealName"],
                      properties: {
                        mealDate: { bsonType: "date" },
                        mealName: { bsonType: "string" },
                      },
                    },
                  },
                },
              },
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });

    // Optional: index for querying meals by user
    await db.collection("usermeals").createIndex({ userId: 1 });
  },

  async down(db, client) {
    await db.collection("usermeals").drop();
  },
};
