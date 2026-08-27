import jwt from "jsonwebtoken";
import { user_schema } from "../../schema/index.mjs";

export const jwtMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).send({
        message: "user unauthorized",
      });
    }

    const decoded_token = jwt.verify(token, process.env.JWT_KEY);

    const currentUser = await user_schema.findOne({ _id: decoded_token._id });
    req.currentUser = currentUser;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send({
      message: "unauthorized user",
    });
  }
};
