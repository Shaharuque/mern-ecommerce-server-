// main logic will be here
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModal from "../modals/userModal.js";

export const registerController = async (req, res) => {
  try {
    // Client side thekey jei data pabo sheita backend a dhorar way is req.body
    const { name, email, password, phone, address, answer, role } = req.body;
    console.log(email);

    // validation
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    // User already registed or not checking
    // get user from DB
    const existingUser = await userModal.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Already Registed please login...",
      });
    }

    //Create new user
    //hashed password
    const hashedPass = await hashPassword(password);

    // Save new user to DB
    const newUser = await new userModal({
      name,
      email,
      password: hashedPass,
      phone,
      address,
      answer,
      role,
    }).save();

    //After successfully creating new user
    res.status(201).send({
      success: true,
      message: "User Created Successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Registration Failed",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    // Getting email password from client side
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Provide Valid Credentials",
      });
    }
    // Check user
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User Not Found",
      });
    }

    //compare the password with the saved hashed password of DB
    const match = await comparePassword(password, user.password); //user.password=>From DB
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Password Invalid",
      });
    }

    //oporer sob validation successfull hobar por token generation part will be started and login successfull holey some info will be sent to client as well
    //Token generation
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Login Failed",
      error,
    });
  }
};

export const test = async (req, res) => {
  try {
    res.status(200).send({
      message: "Good to go",
    });
  } catch (error) {
    res.status(404).send({
      message: "error",
    });
  }
};
