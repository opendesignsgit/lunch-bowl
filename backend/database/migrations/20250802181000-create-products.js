// 20250802181000-create-products.js

module.exports = {
  async up(db, client) {
    await db.createCollection("products", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "slug", "category", "categories", "prices", "isCombination"],
          properties: {
            productId: { bsonType: ["string", "null"] },
            sku: { bsonType: ["string", "null"] },
            barcode: { bsonType: ["string", "null"] },
            title: { bsonType: "object" },
            description: { bsonType: ["object", "null"] },
            slug: { bsonType: "string" },

            categories: {
              bsonType: "array",
              items: { bsonType: "objectId" },
              minItems: 1,
            },
            category: { bsonType: "objectId" },

            image: {
              bsonType: ["array", "null"],
              items: { bsonType: "string" },
            },
            stock: { bsonType: ["number", "null"] },
            sales: { bsonType: ["number", "null"] },

            tag: {
              bsonType: ["array", "null"],
              items: { bsonType: "string" },
            },
            prices: {
              bsonType: "object",
              required: ["originalPrice", "price"],
              properties: {
                originalPrice: { bsonType: "number" },
                price: { bsonType: "number" },
                discount: { bsonType: ["number", "null"] },
              },
            },
            variants: {
              bsonType: "array",
              items: {},
            },
            isCombination: { bsonType: "bool" },
            status: {
              enum: ["show", "hide"],
            },

            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });

    // Optional indexes
    await db.collection("products").createIndex({ slug: 1 }, { unique: true });
    await db.collection("products").createIndex({ category: 1 });
  },

  async down(db, client) {
    await db.collection("products").drop();
  },
};
