"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.number_validation = exports.input_schema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.input_schema = joi_1.default.object({
    website_link: joi_1.default.string()
        .uri({ scheme: ["http", "https"] })
        .required()
        .messages({
        "string.uri": "Please enter a valid URL",
        "string.empty": "Website link is required",
        "any.required": "Website link is required",
    }),
});
exports.number_validation = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
});
