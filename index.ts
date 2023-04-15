import express, { Application } from "express";
import swaggerUI from "swagger-ui-express";
import * as swaggerSpec from "./swagger";
import bodyParser from "body-parser";
import routes from "./scrapper";
import { connectToDatabase } from "./scrapper/db_connection";
import { Db } from "mongodb";

const app: Application = express();
const port = process.env.PORT || 3000;
let db: Db;

(async () => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.use(bodyParser.json());
  app.use("/", routes);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  db = await connectToDatabase();
})();

export default app;
export { db };
