"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
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
module.exports = (0, swagger_jsdoc_1.default)(options);
