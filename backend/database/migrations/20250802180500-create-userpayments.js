// 20250802180500-create-userpayments.js

module.exports = {
  async up(db, client) {
    await db.createCollection("userpayments", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user", "payments", "total_payments", "total_amount", "created_at", "updated_at"],
          properties: {
            user: { bsonType: "objectId" },
            payments: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["order_id", "amount", "order_status"],
                properties: {
                  order_id: { bsonType: "string" },
                  tracking_id: { bsonType: ["string", "null"] },
                  amount: { bsonType: "number" },
                  currency: { bsonType: "string" },
                  order_status: {
                    enum: ["Success", "Failure", "Aborted", "Invalid", "Timeout"],
                  },
                  payment_mode: { bsonType: ["string", "null"] },
                  card_name: { bsonType: ["string", "null"] },
                  status_code: { bsonType: ["string", "null"] },
                  status_message: { bsonType: ["string", "null"] },
                  bank_ref_no: { bsonType: ["string", "null"] },
                  billing_name: { bsonType: ["string", "null"] },
                  billing_email: { bsonType: ["string", "null"] },
                  payment_date: { bsonType: "date" },
                  merchant_param1: { bsonType: ["string", "null"] },
                  merchant_param2: { bsonType: ["string", "null"] },
                  merchant_param3: { bsonType: ["string", "null"] },
                  merchant_param4: { bsonType: ["string", "null"] },
                  merchant_param5: { bsonType: ["string", "null"] },
                },
              },
            },
            total_payments: { bsonType: "number" },
            total_amount: { bsonType: "number" },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" },
          },
        },
      },
    });

    // Add unique index on user field
    await db.collection("userpayments").createIndex({ user: 1 }, { unique: true });
  },

  async down(db, client) {
    await db.collection("userpayments").drop();
  },
};
