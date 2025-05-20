import app from "./index";
import {
  createDatabase,
  checkConnection,
  createTableUser,
  autoCreateAdminUser,
} from "./config/database";
import logger from "./config/logger";

const PORT = process.env.PORT || 5000;
const replicaApp: string | undefined = process.env.APP_NAME || "App_Name";

const initializeServer = async () => {
  try {
    await createDatabase();
    await checkConnection();
    await createTableUser();
    await autoCreateAdminUser();

    app.listen(PORT, () => {
      logger.info("Welcome to the server");
      logger.info(`${replicaApp} is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

initializeServer();
