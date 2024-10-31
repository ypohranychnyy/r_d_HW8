const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  env: {
    BASE_URL: process.env.BASE_URL,
    CLICKUP_API_TOKEN: process.env.CLICKUP_API_TOKEN,
    CLICKUP_FOLDER_ID: process.env.CLICKUP_FOLDER_ID,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
