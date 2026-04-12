/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns a clean JSON response.
 */
export default function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.message}`);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large. Maximum size is 10MB." });
  }

  // Multer general error
  if (err.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }

  // JSON parse errors (from AI responses)
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    return res.status(502).json({ error: "AI returned invalid response. Please try again." });
  }

  // Prisma errors
  if (err.code && typeof err.code === "string" && err.code.startsWith("P")) {
    return res.status(500).json({ error: "Database error. Please check your connection." });
  }

  // Default
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
}
