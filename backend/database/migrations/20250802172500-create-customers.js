// 20250802172500-create-customers.js

module.exports = {
  async up(db, client) {
    await db.createCollection("customers", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "email"],
          properties: {
            name: { bsonType: "string" },
            image: { bsonType: ["string", "null"] },
            address: { bsonType: ["string", "null"] },
            country: { bsonType: ["string", "null"] },
            city: { bsonType: ["string", "null"] },
            shippingAddress: { bsonType: ["object", "null"] },
            email: { bsonType: "string" },
            phone: { bsonType: ["string", "null"] },
            freeTrial: { bsonType: "bool" },
            password: { bsonType: ["string", "null"] },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });

    // Add unique index on email
    await db.collection("customers").createIndex({ email: 1 }, { unique: true });
  },

  async down(db, client) {
    await db.collection("customers").drop();
  },
};
