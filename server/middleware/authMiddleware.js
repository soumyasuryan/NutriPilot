const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Ask Supabase to verify this token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) throw new Error("User not found");

    // Attach user to the request object
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };