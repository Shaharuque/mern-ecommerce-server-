import express from "express";
import {
  loginController,
  registerController,
  test,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Route object to make route
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
router.post("/login", loginController);

//requireSignIn=>middleware to check whether user logged in or not
//isAdmin=>middleware to check whether the user is admin or not
// Protected route
router.get("/test", requireSignIn, isAdmin, test);

export default router;
