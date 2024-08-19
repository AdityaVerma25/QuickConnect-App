const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(request, response) {
  try {
    const token = request.cookies.token;

    if (!token) {
      return response.status(401).json({
        message: "Unauthorized: No token provided",
        success: false,
      });
    }

    const user = await getUserDetailsFromToken(token);

    if (!user) {
      return response.status(401).json({
        message: "Unauthorized: Invalid token",
        success: false,
      });
    }

    const { name, profile_pic } = request.body;

    const updateUser = await UserModel.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );

    if (updateUser.nModified === 0) {
      return response.status(400).json({
        message: "No changes made to the user details",
        success: false,
      });
    }

    const userInformation = await UserModel.findById(user._id);

    return response.json({
      message: "User updated successfully",
      data: userInformation,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
}

module.exports = updateUserDetails;
