const mongoose = require("mongoose");
const { generateValidationError } = require("./error-messages");

/**
 * Validate the type of the value based on the expected type.
 * @param {any} value - The value to validate.
 * @param {any} expectedType - The expected type.
 * @param {string} path - The key path for the current value.
 * @returns {Array} - Array of errors.
 */
const validateType = (value, expectedType, path) => {
  const errors = [];

  if (expectedType === mongoose.Schema.Types.ObjectId) {
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      errors.push(generateValidationError(path, "ObjectId", value));
    }
  } else if (expectedType === String && typeof value !== "string") {
    errors.push(generateValidationError(path, "string", value));
  } else if (expectedType === Number && typeof value !== "number") {
    errors.push(generateValidationError(path, "number", value));
  } else if (expectedType === Boolean && typeof value !== "boolean") {
    errors.push(generateValidationError(path, "boolean", value));
  } else if (expectedType === Date) {
    if (!(value instanceof Date) && isNaN(Date.parse(value))) {
      errors.push(generateValidationError(path, "Date", value));
    }
  } else if (expectedType === Object && typeof value !== "object") {
    errors.push(generateValidationError(path, "object", value));
  } else if (expectedType === Array && !Array.isArray(value)) {
    errors.push(generateValidationError(path, "array", value));
  }

  return errors;
};

/**
 * Validate items in an array based on the expected type.
 * @param {Array} array - The array to validate.
 * @param {any} itemType - The expected type of the items.
 * @param {string} path - The key path for the current value.
 * @returns {Array} - Array of errors.
 */
const validateArrayItems = (array, itemType, path) => {
  const errors = [];

  for (const item of array) {
    if (
      itemType === mongoose.Schema.Types.ObjectId &&
      !mongoose.Types.ObjectId.isValid(item)
    ) {
      errors.push({
        path,
        message: `each item in '${path}' must be of type 'ObjectId', received '${typeof item}'`,
      });
    } else if (itemType === String && typeof item !== "string") {
      errors.push({
        path,
        message: `each item in '${path}' must be of type 'string', received '${typeof item}'`,
      });
    } else if (itemType === Number && typeof item !== "number") {
      errors.push({
        path,
        message: `each item in '${path}' must be of type 'number', received '${typeof item}'`,
      });
    } else if (itemType === Boolean && typeof item !== "boolean") {
      errors.push({
        path,
        message: `each item in '${path}' must be of type 'boolean', received '${typeof item}'`,
      });
    }
    // Additional nested item validations can be added here
  }

  return errors;
};

module.exports = { validateType, validateArrayItems };
