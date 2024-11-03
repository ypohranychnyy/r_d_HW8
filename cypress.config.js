import { defineConfig } from "cypress";
import { allureCypress } from "allure-cypress/reporter";

const dotenv = require("dotenv");
dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      allureCypress(on, config);
      return config;
    },
    env: {
      allure: true,
      allureAttachRequests: true,
      allureReuseAfterSpec: true,
      BASE_URL: process.env.BASE_URL,
      CLICKUP_API_TOKEN: process.env.CLICKUP_API_TOKEN,
      CLICKUP_FOLDER_ID: process.env.CLICKUP_FOLDER_ID,
    }
  },
});