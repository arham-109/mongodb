import express from "express";
import { post_schema } from "../../schema/index.mjs";
import { isValidObjectId } from "mongoose";

const router = express.Router();

router.post("/post", async (req, res) => {
  const { title, description } = req.body;

  try {
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    const newPost = await post_schema.create({
      title: title.trim(),
      description: description.trim(),
    });

    return res.status(201).json({
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    console.error("POST /post Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/post", async (req, res) => {
  try {
    const all_posts = await post_schema.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All posts fetched successfully",
      data: all_posts,
    });
  } catch (error) {
    console.error("GET /post Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    if (!isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    const post = await post_schema.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Single post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.error("GET /post/:postId Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE POST
router.put("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, description } = req.body;

  try {
    if (!isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    const updatedPost = await post_schema.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: title?.trim(),
          description: description?.trim(),
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("PUT /post/:postId Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    if (!isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    const deletedPost = await post_schema.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found or already deleted" });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /post/:postId Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as postRoutes };