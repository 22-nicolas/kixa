import { getUserById, getUserByEmail, registerUser, createSession, validateSession } from "../sql/users.js";
import { Router } from "express";
import bcrypt from 'bcrypt';
import crypto from "crypto";

const router = Router();

const validateForms = {
  login: ['email', 'password'],
  register: [
    'first_name', 'last_name', 'country', 'city', 'zip_code', 
    'street', 'house_number', 'email', 'password', 
    'repeat_password'
  ]
}

router.post("/register", async (req, res) => {
  const userData = req.body;
  const {password} = userData;
  const validateError = await validateUserData(userData, validateForms.register);
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
  const validateError = await validateUserData(formValues, validateForms.login);

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

async function validateUserData(userData, requiredFields) {
  if (!requiredFields) {
    return { error: 'Invalid validation form' };
  }

  const missingFields = requiredFields.filter(field => !userData[field]);

  if (missingFields.length > 0) {
    return { error: `Missing required fields`, missing: missingFields };
  }

  // Validate email format using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    return { error: 'Invalid email format' };
  }

  // Return early for login validation.
  if (requiredFields === validateForms.login) return null;

  // Check if email is unique
  const emailExists = await getUserByEmail(userData.email);
  if (emailExists != null) {
    return { error: 'Email already exists' };
  }

  // Check if repeat password matches password
  if (userData.password !== userData.repeat_password) {
    return { error: 'Passwords do not match' };
  }    

  return null; // Indicates successful validation
}