import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user detail from frontend
  const { email, fullName, userName, password } = req.body;

  //validaton - not empty
  console.log("email :", email);
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fieldare required");
  }

  //check if user already exist  usrname,email
  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "username and email is already exist");
  }

  //check for images,check for avatar
  const avatarLocatPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocatPath) {
    throw new ApiError(400, " avatar file not found");
  }

  //upload them cloudinary
  const avatar = await uploadOnCloudinary(avatarLocatPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  //create user object create in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // cover image is not required
    email,
    password,
    userName: userName.toLowerCase(),
  });

  //remove password and refresh token field from response
  //check for user creation
  const createdUser = await User.findById(user?.id).select(
    "-password -refreshToken"
  ); // every entry created new id in database  -password and -refreshToken use to remove from createdUser
  if (!createdUser) {
    throw new ApiError(400, "something isworng while registing the user");
  }

  //return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
