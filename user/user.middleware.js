import mongoose from "mongoose";

import { registerUserValidation } from "./user.validation.js";

export const userValidationSchema = async (req, res, next) => {
  const newUser = req.body;
  try {
    const validatedData = await registerUserValidation.validate(newUser);
    req.body = validatedData;
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  next();
};

export const checkMongoIdFromParams = (req, res, next) => {
  // extract id from req.params
  const id = req.params.id;
  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(id);
  // if not mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid Mongo Id" });
  }
  // call next function
  next();
};
