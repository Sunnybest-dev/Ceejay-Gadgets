require("dotenv").config();

const app = require("./src/app"); // app.js is inside src
const { connectDB, sequelize } = require("./src/config/db"); // db.js is inside src/config

// This will load all models and associations
require("./src/models/Index");

// Start server
const PORT = process.env.PORT || 5000;
(async () => {
  await connectDB();             // Connects to MySQL
  // Use { alter: true } in dev to sync without dropping data.
  // For production, rely on migrations. Wrap sync in try/catch so
  // a duplicate-column ALTER (from a previous migration) doesn't crash.
  try {
    await sequelize.sync({ alter: true });
  } catch (err) {
    // Ignore duplicate-field errors which can occur if the DB already
    // has the foreign key/column created by migrations.
    const isDuplicateField =
      err && err.parent && (
        err.parent.code === "ER_DUP_FIELDNAME" ||
        err.parent.code === "ER_TOO_MANY_KEYS" ||
        /Duplicate column name/i.test(err.parent.sqlMessage || "") ||
        /Too many keys specified/i.test(err.parent.sqlMessage || "")
      );
    if (isDuplicateField) {
      console.warn("Ignored duplicate-column error during sync:", err.parent && err.parent.sqlMessage);
    } else {
      throw err;
    }
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();