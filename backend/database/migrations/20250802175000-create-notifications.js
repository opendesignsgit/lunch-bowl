// 20250802175000-create-notifications.js

module.exports = {
  async up(db, client) {
    await db.createCollection("notifications", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["message"],
          properties: {
            orderId: { bsonType: ["objectId", "null"] },
            productId: { bsonType: ["objectId", "null"] },
            adminId: { bsonType: ["objectId", "null"] },
            message: { bsonType: "string" },
            image: { bsonType: ["string", "null"] },
            status: {
              enum: ["read", "unread"],
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });
  },

  async down(db, client) {
    await db.collection("notifications").drop();
  },
};
