const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "2m" }
  );
};

const auth = async (req, res, next) => {
  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY || "Authorization";
  const token = req.header(tokenHeaderKey);

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const tokenWithoutBearer = token.split(" ")[1];
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: "Token expiré et refresh token manquant" });
      }

      try {
        const verifiedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const admin = await Admin.findById(verifiedRefreshToken.id);

        if (!admin || !admin.refreshTokens.includes(refreshToken)) {
          return res
            .status(403)
            .json({ message: "Refresh token invalide ou expiré" });
        }

        const newAccessToken = generateAccessToken(admin);
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        req.user = verifiedRefreshToken;
        next();
      } catch (err) {
        return res
          .status(403)
          .json({ message: "Refresh token invalide", error: err.message });
      }
    } else {
      return res.status(401).json({ message: "Token invalide" });
    }
  }
};

module.exports = auth;
