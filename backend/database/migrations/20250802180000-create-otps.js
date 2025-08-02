// 20250802180000-create-otps.js

module.exports = {
  async up(db, client) {
    await db.createCollection("otps", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["mobile", "otp", "expiresAt"],
          properties: {
            mobile: { bsonType: "string" },
            otp: { bsonType: "string" },
            expiresAt: { bsonType: "date" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });

    // TTL index: removes documents once `expiresAt` is reached
    await db.collection("otps").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
  },

  async down(db, client) {
    await db.collection("otps").drop();
  },
};
