import express from "express";

const router = express.Router();

router.post("/post", (req, res, next) => {
  try {
    res.send({
      message: "Post created successfully",
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/post", (req, res, next) => {
  try {
    res.send({
      message: "All post fetched successfully",
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/post:postId", (res, req, next) => {
  const postId = req.params.postId;
  try {
    res.send({
      message: "single post fetched successfully",
    });
  } catch (error) {
    console.error(error);
  }
});

router.put("/post:postId", (res, req, next) => {
  const postId = req.params.postId;
  try {
    res.send({
      message: "post updated successfully",
    });
  } catch (error) {
    console.error(error);
  }
});

router.delete("/post:postId", (req, res, next) => {
  const postId = req.params.postId;

  try {
    res.send({
      message: "podt deleted successfully",
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
