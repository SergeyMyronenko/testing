import userModel from "../db/userModel.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

// export async function authenticateBasic(req, res, next) {
//   try {
//     const authData = req.headers.authorization;
//     if (!authData) {
//       return res.status(401).send("Unauthorized");
//     }
//     const [method, base64Data] = authData.split(" ");

//     if (method !== "Basic") {
//       return res.status(401).send("Unauthorized");
//     }
//     const [email, password] = Buffer.from(base64Data, "base64")
//       .toString()
//       .split(":");

//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.status(401).send("Unauthorized");
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).send("Unauthorized");
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     next(error);
//   }
// }

export async function authenticate(req, res, next) {
  try {
    const authData = req.headers.authorization;
    if (!authData) {
      return res.status(401).send("Unauthorized");
    }

    const [method, token] = authData.split(" ");

    if (method !== "Bearer") {
      return res.status(401).send("Unauthorized");
    }
    const { id } = JWT.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ _id: id });
    if (token !== user.token) {
      return res.staus(401).send("Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
