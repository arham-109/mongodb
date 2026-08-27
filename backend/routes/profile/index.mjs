import express from "express";
import { user_schema } from "../../schema/index.mjs";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/profile", (req, res, next) => {
  try {
    return res.send({
      message: "Profile fetched successfully",
      data: req.currentUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server error",
    });
  }
});

router.put("/profile", async (req, res, next) => {
  try {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const user = await user_schema.findOne({ _id: req.currentUser._id });

    if (!user) {
      return res.status.send({
        message: "User not found ",
      });
    }
    if (firstname) {
      user.firstname = firstname;
    }
    if (lastname) {
      user.lastname = lastname;
    }
    await user.save();
    return res.send({
      message: "Profile updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.put("/password", async (req, res, next) => {
  try {
    const current_password = req.body.current_password;
    const new_password = req.body.new_password;

    const confirm_password = await bcrypt.compare(
      current_password,
      req.currentUser.password,
    );

    if (!confirm_password) {
     return res.status(400).send({
        message: "current password invalid",
      });
    }

    const update_password = await bcrypt.hash(new_password, 12);

    await user_schema.findByIdAndUpdate(
      { _id: req.currentUser._id },
      {
        $set: {
          password: update_password,
        },
      },
    );
    return res.send({
        message : "password updated"
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

export default router;
