import { getUserById, getUserByEmail, registerUser, createSession, validateSession } from "../sql/users.js";
import { Router } from "express";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import { validateForms, validateForm } from "../modules/validateForms.js";

const router = Router();

router.post("/register", async (req, res) => {
  const userData = req.body;
  const {password} = userData;
  const validateError = await validateForm(userData, validateForms.register);
  if (validateError) {
    if (validateError === "Invalid validation form") {
      return res.status(400).send("Internal Server error: Invalid validation form");
    }
    res.status(400).send(validateError);
    return;
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  userData.password = hashedPassword;

  await registerUser(userData);

  res.status(201).send();
});

router.post("/login", async (req, res) => {
  const formValues = req.body;
  const validateError = await validateForm(formValues, validateForms.login);

  if (validateError) {
    if (validateError === "Invalid validation form") {
      return res.status(400).send("Internal Server error: Invalid validation form");
    }
    res.status(400).send(validateError);
    return;
  }

  const {email, password} = formValues
  const userData = await getUserByEmail(email);

  if (userData == null) {
    return res.status(400).send({error: "Cannot find user", missing: ["email"]});
  }

  try {
    if(await bcrypt.compare(password, userData.password)) {
      //create session
      const sessionId = await createSession(userData.user_id);
      res.status(200).send({sessionId: sessionId});
    } else {
      res.status(400).send({error: "Wrong password", missing: ["password"]});
    }
  } catch {
    res.status(500).send();
  }
})

router.get("/sessions/:id", async (req, res) => {
  const sessionId = req.params.id;

  //validate session id type
  if (typeof(sessionId) !== "string") return res.status(400).send("Invalid session id");

  //hash session id
  const hashedSessionId =  crypto.createHash("sha256").update(sessionId).digest("hex");

  //validate session
  const sessionData = await validateSession(hashedSessionId);
  if (!sessionData || sessionData.length === 0) {
    return res.status(401).send("Unauthorized");
  }

  //get user data
  const userId = sessionData.user_id;

  const userData = await getUserById(userId);
  if (!userData) {
    return res.status(404).send("User not found");
  }
  res.status(200).send(userData);
});

export default router;