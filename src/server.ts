import app from "./index";
import {
  createDatabase,
  checkConnection,
  createTableUser,
} from "./config/database";
import logger from "./config/logger";

const PORT = process.env.PORT || 5000;
const replicaApp: string | undefined = process.env.APP_NAME || "App_Name";

const initializeServer = async () => {
  try {
    await createDatabase();
    await checkConnection();
    await createTableUser();

    app.listen(PORT, () => {
      // console.log(process.env.DB_NAME);
      // console.log(">>> ", process.env.APP_NAME);
      logger.info(`${replicaApp} is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

initializeServer();
