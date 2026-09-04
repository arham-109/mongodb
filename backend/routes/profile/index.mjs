import express from "express";
import { user_schema } from "../../schema/index.mjs";
import bcrypt from "bcryptjs";
import { multer_middleware } from "../../libs/multer.mjs";
import { cloudinaryUpload } from "../../libs/cloudinary.mjs";
import path from "node:path";

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
      return res.status(404).send({
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
      message: "password updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.put(
  "/profile-picture",
  multer_middleware.any(),
  async (req, res, next) => {
    try {
      const file = req.files[0];

      if (!file) {
        return res.status(400).send({
          message: "file is required",
        });
      }

      const image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      const file_extension = path.extname(file.originalname).toLowerCase();
      const is_image =
        file.mimetype.startsWith("image/") ||
        (file.mimetype === "application/octet-stream" &&
          image_extensions.includes(file_extension));

      if (!is_image) {
        return res.status(400).send({
          message: "Only image is required",
        });
      }
      if (file.size > 1000000) {
        return res.status(400).send({
          message: "File size with only 1mb is required",
        });
      }

      const file_resp = await cloudinaryUpload(file);
      await user_schema.findByIdAndUpdate(
        req.currentUser._id ,
        {
          $set: {
            profile_picture: file_resp.url,
          },
        },
      );
      return res.send({
        message: "Profile picture updated",
        url: file_resp.url,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Internal server error",
      });
    }
  },
);

export default router;
