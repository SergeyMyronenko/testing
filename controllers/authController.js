import JWT from "jsonwebtoken";
import userModel from "../db/userModel.js";
import bcrypt from "bcrypt";

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(409).send({ message: "User is already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({ email, password: hashPassword });

    res.send(newUser);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send("email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("email or password is wrong");
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await userModel.findOneAndUpdate({ email }, { token });
    res.send(token);
  } catch (error) {
    next(error);
  }
}

export function getUser(req, res) {
  res.send(req.user);
}
