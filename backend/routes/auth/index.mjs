import express from "express";
import { user_schema } from "../../schema/index.mjs";
import { email_pattern } from "../../utilis/core.mjs";
import { password_pattern } from "../../utilis/core.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    if (!firstname) {
      return res.status(400).send({
        message: "Firstname is required",
      });
    }
    if (!lastname) {
      return res.status(400).send({
        message: "lastname is required",
      });
    }

    if (!email) {
      return res.status(400).send({
        message: "email is required",
      });
    }
    if (!password) {
      return res.status(400).send({
        message: "password is required",
      });
    }

    if (!email_pattern.test(email.toLowerCase())) {
      return res.status(400).send({
        message: "email is invalid",
      });
    }
    if (!password_pattern.test(password)) {
      return res.status(400).send({
        message: "Password Invalid",
      });
    }

    const user = await user_schema.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(404).send({
        message: "email already taken",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    await user_schema.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashPassword,
    });

    return res.send({
      message: "signup successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).send({
        message: "password is required",
      });
    }

    const findAccount = await user_schema.findOne({
      email: email.toLowerCase(),
    });

    if (!findAccount) {
      return res.status(400).send({
        message: "Invalid credentials",
      });
    }

    const checkPassword = await bcrypt.compare(password, findAccount.password);

    if (!checkPassword) {
      return res.status(400).send({
        message: "Invalid Credentials",
      });
    }

    const jwtToken = jwt.sign(
      {
        email: findAccount.email,
        _id: findAccount._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: `24h`,
      },
    );

    return res.send({
      message: "login successful",
      data: {
        token: jwtToken,
        user: findAccount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

export default router;
