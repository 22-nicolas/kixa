import { getUserByEmail } from "../sql.js";
import { Router } from "express";
import bcrypt from 'bcrypt';

const router = Router();

router.post("/register", async (req, res) => {
  const userData = req.body;
  const {password} = userData;
  const validateResult = await validateUserData(userData);
  if (validateResult) {
    res.status(400).send(validateResult);
    return;
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  userData.password = hashedPassword;

  await registerUser(userData);

  res.status(201).send();
});

router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  const userData = await getUserByEmail(email);

  if (userData == null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    if(await bcrypt.compare(password, userData.password)) {
      res.status(200).send("Success");
    } else {
      res.status(400).send("Wrong password");
    }
  } catch {
    res.status(500).send();
  }
})

export default router;

async function validateUserData(userData) {
    const requiredFields = [
        'first_name', 'last_name', 'country', 'city', 'zip_code', 
        'street', 'house_number', 'email', 'password', 
        'repeat_password'
    ];

    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
        return { error: `Missing required fields`, missing: missingFields };
    }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return { error: 'Invalid email format' };
    }

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