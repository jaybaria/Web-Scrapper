import Joi from "joi";

export const input_schema = Joi.object({
  website_link: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required()
    .messages({
      "string.uri": "Please enter a valid URL",
      "string.empty": "Website link is required",
      "any.required": "Website link is required",
    }),
});

export const number_validation = Joi.object({
  id: Joi.number().integer().required(),
});
