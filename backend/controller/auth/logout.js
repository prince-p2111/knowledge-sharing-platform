require("dotenv").config();
const {
  generateErrorResponse,
  generateResponse,
} = require("../../helper/response");

const logout = async (req, res) => {
  try {
    res.clearCookie("token"); // Clear auth token from browser
    return res
      .status(200)
      .json(generateResponse(true, "User logout successfully"));
  } catch (error) {
    console.log("Logout user API : ", error);
    return res
      .status(500)
      .json(generateErrorResponse("Internal server error", error.message));
  }
};

module.exports = { logout };
