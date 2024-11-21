import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvater,
  updateUserCoverImage,
  getUserChanelProfile,
  getWatchHistory,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvater);
router
  .route("/cover-Image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:userName").get(verifyJWT, getUserChanelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);
export default router;
