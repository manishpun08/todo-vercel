import express from "express";
import {
  forgetPasswordValidationSchema,
  userEmailValidation,
  verifyOtpValidation,
} from "./forget.validation.js";
import { User } from "../user/user.model.js";
import otpGenerator from "otp-generator";
import { OTP } from "./otp.model.js";
import { sendEmailOTP } from "./email.service.js";
import bcrypt from "bcrypt";

const router = express.Router();

// send opt to email
router.post(
  "/otp/send",
  //validating data
  async (req, res, next) => {
    // extract new values from req.body
    const newValues = req.body;

    // validating new values using Yup Schema
    try {
      const validatedData = await userEmailValidation.validate(newValues);
      req.body = newValues;
    } catch (error) {
      // if validation fails throw error
      return res.status(400).send({ message: error.message });
    }
    next();
  },
  // find email
  async (req, res) => {
    // extract email from req.body
    const { email } = req.body;

    // find user using email
    const user = await User.findOne({ email });

    // if no user throw error
    if (!user) {
      return res.status(400).send({ message: "Email does not exist." });
    }

    // generate otp and send otp
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // send email
    await sendEmailOTP(user.firstName, otp);

    // delete previous otp if same email request multiple times
    await OTP.deleteMany({ email });

    // create otp table
    await OTP.create({ otp, email });

    // send response
    return res.status(200).send({ message: "OTP is sent successfully." });
  }
);

// verify otp
router.post(
  "/otp/verify",
  // validating data
  async (req, res, next) => {
    // extract new values from req.body
    const newValues = req.body;

    // validate new values from yup schema
    try {
      const validatedData = await verifyOtpValidation.validate(newValues);
      req.body = newValues;
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
    next();
  },

  async (req, res) => {
    // extract verification data from req.body
    const verificationData = req.body;

    // find otp document using email
    const otpDoc = await OTP.findOne({ email: verificationData.email });

    // if no otp, throw error
    if (!otpDoc) {
      return res.status(400).send({ message: "no otp doc fount" });
    }

    //check otp if matches
    const isOtpMatch = verificationData.otp === otpDoc.otp;

    // if otp not match, throw error
    if (!isOtpMatch) {
      return res.status(400).send({ message: "otp doesnot match" });
    }

    // set is verified to true
    await OTP.updateOne(
      { email: verificationData.email },
      {
        $set: {
          isVerified: true,
        },
      }
    );

    // send status
    return res.status(200).send({ message: "Opt is verified successfully." });
  }
);

// change password
router.put(
  "/otp/change-password",
  //validating data
  async (req, res, next) => {
    // extract new values form req.body
    const newValues = req.body;

    try {
      const validatedData = await forgetPasswordValidationSchema.validate(
        newValues
      );
      req.body = validatedData;
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
    next();
  },

  async (req, res) => {
    // extract new password from req.body
    const { email, newPassword } = req.body;

    // find otp document using this email
    const otpDoc = await OTP.findOne({ email });

    //if not otpDoc, throw error
    if (!otpDoc) {
      return res.status(404).send({ message: "Something went wrong." });
    }

    //if otp is not verified, throw error
    if (!otpDoc.isVerified) {
      return res.status(404).send({ message: "Something went wrong." });
    }

    // let user change password
    // password should be hashed format
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update password
    await User.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    // delete otp doc for this email
    await OTP.deleteMany({ email });

    return res
      .status(200)
      .send({ message: "Password is changed successfully." });
  }
);

export default router;
