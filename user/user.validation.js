import * as Yup from "yup";

export const registerUserValidation = Yup.object({
  name: Yup.string().required().max(55, "Name is must be of 55 character."),
  email: Yup.string()
    .email()
    .required()
    .trim()
    .max(55, "Email must be of max 55 character."),
  password: Yup.string()
    .required()
    .min(4, "Password must be at least 4 character."),
  gender: Yup.string().nullable().oneOf(["male", "female", "preferNotToSay"]),
});

export const loginUserValidation = Yup.object({
  email: Yup.string()
    .email()
    .required()
    .trim()
    .max(55, "Email must be of max 55 character."),
  password: Yup.string().required("Password is required.").trim(),
});
