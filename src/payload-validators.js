const mongoose = require("mongoose");
const { validateType, validateArrayItems } = require("./utils/type-validators");
const { isValidMongooseSchema } = require("./utils/mongoose-instance");
const {
  sendSchemaValidationError,
  sendBadRequestError,
  sendUnprocessableEntityError,
} = require("./utils/error-handler");

/**
 * Validates the incoming request payload against the provided Mongoose schema.
 * @param {Object} mongooseSchema - The Mongoose schema to validate against.
 * @param {Object} options - Options to control validation behavior.
 * @returns {Function} - Express middleware function.
*/
const validatePayload = (mongooseSchema) => {
  return (req, res, next) => {
    mongooseSchema = mongooseSchema.schema || mongooseSchema;
    const isValidMongooseObject = isValidMongooseSchema(mongooseSchema);
    
    if (!isValidMongooseObject) {
      return sendSchemaValidationError(res);
    }

    const schema = mongooseSchema.obj;

    const validate = (payload, rules, basePath) => {
      const errors = [];

      for (const key in rules) {
        let rule = rules[key];
        const value = payload[key];

        if (typeof rule === "function") {
          rule =
            rule === mongoose.Schema.Types.ObjectId ||
            rule.name === "SchemaObjectId"
              ? { type: mongoose.Schema.Types.ObjectId }
              : { type: rule };
        }

        if (rule.required && !(key in payload)) {
          errors.push({
            path: basePath ? `${basePath}.${key}` : key,
            message: `must have required property '${key}'`,
          });
        }

        if (key in payload) {
          const expectedType = rule.type;
          errors.push(
            ...validateType(
              value,
              expectedType,
              basePath ? `${basePath}.${key}` : key
            )
          );

          if (
            expectedType === Object &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            const nestedErrors = validate(
              value,
              rule.properties,
              basePath ? `${basePath}.${key}` : key
            );
            errors.push(...nestedErrors);
          } else if (Array.isArray(expectedType) && Array.isArray(value)) {
            const itemType = expectedType[0];
            errors.push(
              ...validateArrayItems(
                value,
                itemType,
                basePath ? `${basePath}.${key}` : key
              )
            );
          }
        }
      }

      return errors;
    };

    const payload = req.body;

    if (
      !payload ||
      (typeof payload === "object" && Object.keys(payload).length === 0)
    ) {
      return sendBadRequestError(res);
    }

    const errors = validate(payload, schema);

    for (const key in payload) {
      if (!(key in schema)) {
        errors.push({
          path: key,
          message: `must NOT have additional properties`,
        });
      }
    }

    if (errors.length) {
      return sendUnprocessableEntityError(res, errors);
    }

    next();
  };
};

module.exports = validatePayload;
