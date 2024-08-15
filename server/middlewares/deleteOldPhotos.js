const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const directory = path.join("uploads", "profile_pictures");

cron.schedule("0 0 * * *", () => {
  console.log("Running task to delete old photos at 12:00 AM");

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${file}: ${err.message}`);
        } else {
          console.log(`Deleted file: ${file}`);
        }
      });
    });
  });
});

console.log("Cron job scheduled to delete old photos every day at 12:00 AM");
