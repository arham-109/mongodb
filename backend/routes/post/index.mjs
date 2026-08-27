import express from "express";
import { post_schema } from "../../schema/index.mjs";
import { isValidObjectId } from "mongoose";
const router = express.Router();

router.post("/post", async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  try {
    if (!title) {
      return res.status(400).send({
        message: "Title is required",
      });
    }
    if (!description) {
      return res.status(400).send({
        message: "Description is required",
      });
    }

    const new_post = await post_schema.create({
      title: req.body.title,
      description: req.body.description,
    });

    req.io.emit("post_created", new_post);

    res.send({
      message: "Post created successfully",
      data: new_post,
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/post", async (req, res, next) => {
  try {
    const all_posts = await post_schema.find();
    res.send({
      message: "All post fetched successfully",
      data: all_posts,
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/post/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  try {
    if (!postId) {
      return res.status(400).send({
        message: "Post Id is required",
      });
    }
    if (!isValidObjectId(postId)) {
      return res.status(400).send({
        message: "Post Id is invalid",
      });
    }
    const get_posts = await post_schema.findById({ _id: req.params.postId });

    if (!get_posts) {
      return res.status(400).send({
        message: "Post not found",
      });
    }
    res.send({
      message: "single post fetched successfully",
      data: get_posts,
    });
  } catch (error) {
    console.error(error);
  }
});

router.put("/post/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  try {
    if (!postId) {
      return res.status(400).send({
        message: "Post id is required",
      });
    }
    if (!isValidObjectId(postId)) {
      return res.status(400).send({
        message: "Post id is invalid",
      });
    }

    const update_post = await post_schema.findByIdAndUpdate(
      { _id: postId },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
        },
      },
    );

    if (!update_post) {
      return res.status(404).send({
        message: "Post not found",
      });
    }

    res.send({
      message: "post updated successfully",
    });
  } catch (error) {
    console.error(error);
  }
});

router.delete("/post/:postId", async (req, res, next) => {
  const postId = req.params.postId;

  try {
    if (!postId) {
      return res.status(400).send({
        message: "Post ID is required",
      });
    }
    if (!isValidObjectId(postId)) {
      return res.status(400).send({
        message: "Post id invalid",
      });
    }
    const delete_post = await post_schema.findByIdAndDelete({
      _id: req.params.postId,
    });
    if (!delete_post) {
      return res.status(400).send({
        message: "Post already deleted",
      });
    }
    res.send({
      message: "post deleted successfully",
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
