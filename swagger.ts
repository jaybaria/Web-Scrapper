import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Food Products Scrapper API",
    version: "1.0.0",
    description: "API for retrieving food product information",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./scrapper/index.ts"],
};

module.exports = swaggerJSDoc(options);
