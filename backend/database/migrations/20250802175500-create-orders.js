// 20250802175500-create-orders.js

module.exports = {
  async up(db, client) {
    await db.createCollection("orders", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user", "subTotal", "shippingCost", "total", "paymentMethod"],
          properties: {
            user: { bsonType: "objectId" },
            invoice: { bsonType: ["int", "null"] }, // auto-incremented via mongoose-sequence
            cart: {
              bsonType: "array",
              items: {},
            },
            user_info: {
              bsonType: "object",
              properties: {
                name: { bsonType: ["string", "null"] },
                email: { bsonType: ["string", "null"] },
                contact: { bsonType: ["string", "null"] },
                address: { bsonType: ["string", "null"] },
                city: { bsonType: ["string", "null"] },
                country: { bsonType: ["string", "null"] },
                zipCode: { bsonType: ["string", "null"] },
              },
            },
            subTotal: { bsonType: "number" },
            shippingCost: { bsonType: "number" },
            discount: { bsonType: "number" },
            total: { bsonType: "number" },
            shippingOption: { bsonType: ["string", "null"] },
            paymentMethod: { bsonType: "string" },
            cardInfo: { bsonType: ["object", "null"] },
            status: {
              enum: ["Pending", "Processing", "Delivered", "Cancel"],
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });

    // Optional index (e.g. on user or invoice)
    await db.collection("orders").createIndex({ invoice: 1 }, { unique: false });
  },

  async down(db, client) {
    await db.collection("orders").drop();
  },
};
