

## Mongoose Payload Validator (Express.js)

A middleware for validating request payloads against a Mongoose schema in **Express.js** applications using **JavaScript**. This package ensures the incoming request body adheres to the Mongoose schema structure, type definitions, and required constraints.

## Features

- **Express.js Only**: This middleware is designed specifically for Express.js applications.
- Validates payloads against a Mongoose schema.
- Supports nested objects, arrays, and enums.
- Handles required fields and type validation.
- Easy-to-use as Express middleware.

## Installation

Install via npm:

```bash
npm install mongoose-payload-validator
```

## Usage

1. Import the `validatePayload` middleware.
2. Pass the Mongoose schema and options.
3. Use it in your Express routes.

### Example

```js
const express = require("express");
const mongoose = require("mongoose");
const validatePayload = require("mongoose-payload-validator");

const app = express();
app.use(express.json());

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number },
  role: { type: String, enum: ["admin", "user", "guest"] },
});

// Middleware to validate request body
app.post("/user", validatePayload(userSchema), (req, res) => {
  res.json({ message: "User data is valid!" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

### Nested Objects and Arrays

```js
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  tags: [{ type: String }],
});

// Apply middleware
app.post("/post", validatePayload(postSchema), (req, res) => {
  res.json({ message: "Post data is valid!" });
});
```

## Error Responses

When validation fails, the middleware responds with a detailed error message:

- **400 BadRequestError**: If the request body is empty or not provided.
- **422 UnprocessableEntityError**: If the payload fails validation.

Example error response:

```json
{
  "error": {
    "statusCode": 422,
    "name": "UnprocessableEntityError",
    "message": "The request body is invalid. See error object `details` property for more info.",
    "details": [
      {
        "path": "email",
        "message": "must have required property 'email'"
      },
      {
        "path": "age",
        "message": "must be of type 'number', received 'string'"
      }
    ]
  }
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

This version clearly states that the middleware is specifically for use in **Express.js with JavaScript**

