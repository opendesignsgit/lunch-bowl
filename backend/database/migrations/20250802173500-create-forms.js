// 20250802173500-create-forms.js

module.exports = {
  async up(db, client) {
    await db.createCollection("forms", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user", "parentDetails", "children", "subscriptionPlan", "paymentStatus", "subscriptionCount"],
          properties: {
            user: { bsonType: "objectId" },
            step: { bsonType: "number" },

            parentDetails: {
              bsonType: "object",
              required: [
                "fatherFirstName",
                "fatherLastName",
                "motherFirstName",
                "motherLastName",
                "mobile",
                "email",
                "address",
                "pincode",
                "city",
                "state",
                "country"
              ],
              properties: {
                fatherFirstName: { bsonType: "string" },
                fatherLastName: { bsonType: "string" },
                motherFirstName: { bsonType: "string" },
                motherLastName: { bsonType: "string" },
                mobile: {
                  bsonType: "string",
                  pattern: "^[0-9]{10}$",
                },
                email: {
                  bsonType: "string",
                  pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                },
                address: { bsonType: "string" },
                pincode: {
                  bsonType: "string",
                  pattern: "^[0-9]{6}$",
                },
                city: { bsonType: "string" },
                state: { bsonType: "string" },
                country: { bsonType: "string" },
              },
            },

            children: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: [
                  "childFirstName",
                  "childLastName",
                  "dob",
                  "lunchTime",
                  "school",
                  "location",
                  "childClass",
                  "section",
                ],
                properties: {
                  childFirstName: { bsonType: "string" },
                  childLastName: { bsonType: "string" },
                  dob: { bsonType: "date" },
                  lunchTime: { bsonType: "string" },
                  school: { bsonType: "string" },
                  location: { bsonType: "string" },
                  childClass: { bsonType: "string" },
                  section: { bsonType: "string" },
                  allergies: { bsonType: "string" },
                },
              },
              minItems: 1,
            },

            subscriptionPlan: {
              bsonType: "object",
              required: ["planId", "startDate", "endDate", "workingDays", "price"],
              properties: {
                planId: { bsonType: "string" },
                startDate: { bsonType: "date" },
                endDate: { bsonType: "date" },
                workingDays: { bsonType: "number" },
                price: { bsonType: "number" },
                orderId: { bsonType: ["string", "null"] },
                paymentAmount: { bsonType: ["number", "null"] },
                paymentDate: { bsonType: ["date", "null"] },
                paymentMethod: { bsonType: "string" },
                transactionId: { bsonType: ["string", "null"] },
              },
            },

            paymentStatus: { bsonType: "string" },
            subscriptionCount: { bsonType: "number" },
          },
        },
      },
    });

    // Optional: Add index on user or orderId
    await db.collection("forms").createIndex({ user: 1 });
  },

  async down(db, client) {
    await db.collection("forms").drop();
  },
};
