// 20250802170000-create-admins.js

const bcrypt = require("bcryptjs");

module.exports = {
  async up(db, client) {
    // Create the Admins collection with schema validation
    await db.createCollection("admins", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "email", "role"],
          properties: {
            name: { bsonType: "object" },
            image: { bsonType: ["string", "null"] },
            address: { bsonType: ["string", "null"] },
            country: { bsonType: ["string", "null"] },
            city: { bsonType: ["string", "null"] },
            email: { bsonType: "string" },
            phone: { bsonType: ["string", "null"] },
            status: { enum: ["Active", "Inactive"] },
            password: { bsonType: "string" },
            role: {
              enum: [
                "Admin",
                "Super Admin",
                "Cashier",
                "Manager",
                "CEO",
                "Driver",
                "Security Guard",
                "Accountant",
              ],
            },
            access_list: { bsonType: ["array", "null"] },
            joiningData: { bsonType: ["date", "null"] },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });

    // Add a unique index on the email field
    await db.collection("admins").createIndex({ email: 1 }, { unique: true });

    // Insert an initial admin (optional)
    await db.collection("admins").insertOne({
      name: { en: "Default Admin" },
      email: "admin@example.com",
      password: bcrypt.hashSync("12345678"),
      role: "Super Admin",
      status: "Active",
      access_list: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down(db, client) {
    await db.collection("admins").drop();
  },
};
