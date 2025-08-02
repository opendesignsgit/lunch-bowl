// 20250802171500-create-coupons.js

module.exports = {
  async up(db, client) {
    await db.createCollection("coupons", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "couponCode", "minimumAmount", "endTime"],
          properties: {
            title: { bsonType: "object" },
            logo: { bsonType: ["string", "null"] },
            couponCode: { bsonType: "string" },
            startTime: { bsonType: ["date", "null"] },
            endTime: { bsonType: "date" },
            discountType: { bsonType: ["object", "null"] },
            minimumAmount: { bsonType: "number" },
            productType: { bsonType: ["string", "null"] },
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
    await db.collection("coupons").drop();
  },
};
