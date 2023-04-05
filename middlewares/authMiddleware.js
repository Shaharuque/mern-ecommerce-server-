import jwt from "jsonwebtoken";
import userModal from "../modals/userModal.js";

// if user is singed in or not sheita ai middleware diye check kora hocchey
export const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    // Verify the jwt token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).send("Invalid token.");
      }
      req.user = decoded; //req.user={id: user._id}
      console.log(req.user.id);
      //is everything ok then it gonna says next() to excute remaining from where this middleware called
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in verify token middelware",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    // find the user by its id
    const userFromDB = await userModal.findById(req.user.id);
    console.log(userFromDB);
    if (userFromDB?.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
