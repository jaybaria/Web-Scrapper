import express, { Application } from "express";
import swaggerUI from "swagger-ui-express";
import * as swaggerSpec from "./swagger";
import bodyParser from "body-parser";
import routes from "./scrapper";
import connectToDatabase from "./scrapper/db_connection";

const app: Application = express();
const port = process.env.PORT || 3000;

(async () => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.use(bodyParser.json());
  app.use("/", routes);

  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();

export default app;
