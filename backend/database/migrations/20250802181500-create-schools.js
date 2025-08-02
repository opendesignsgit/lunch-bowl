// 20250802181500-create-schools.js

module.exports = {
  async up(db, client) {
    await db.createCollection("schools", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "location", "lunchTime"],
          properties: {
            name: {
              bsonType: "string",
              description: "Must be a string and is required",
            },
            location: {
              bsonType: "string",
              description: "Must be a string and is required",
            },
            lunchTime: {
              bsonType: "string",
              description: "Must be a string in HH:MM format",
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });
  },

  async down(db, client) {
    await db.collection("schools").drop();
  },
};
