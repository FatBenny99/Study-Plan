const sqlite3 = require("sqlite3");

const database = new sqlite3.Database("./database.db", (err) => {
   if (err) {
      console.log(err);
      throw err;
   }
});

module.exports = database;