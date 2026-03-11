import AppError from "../utils/AppError.js";
import { asyncHandler } from "./async.middleware.js";

export const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    try {
      const validatedData = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.body = validatedData;
      next();
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: err.errors
      })
    }
  });
