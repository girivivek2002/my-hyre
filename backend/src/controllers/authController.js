import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

// Ensure a JWT SECRET is defined or use a fallback for local testing
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

/**
 * POST /api/auth/signup
 */
export async function signup(req, res, next) {
  try {
    const { email, password, name, phone, role, website, industry, teamSize } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user into DB
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        phone,
        website,
        industry,
        teamSize,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate token securely
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    });
  } catch (error) {
    next(error);
  }
}
