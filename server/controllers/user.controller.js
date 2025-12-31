import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'  
import VerificationEmail from '../utils/verifyEmailTemplate.js';
import sendEmailFun from '../config/sendEmail.js';
import generetedAccessToken from '../utils/generatedAccessToken.js';
import generetedRefreshToken from '../utils/generatedRefreshToken.js';

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


export async function registerUserController(request,response){
  try{
    let user;

    const { name, email, password} = request.body;
    if(!name || !email || !password){
      return response.status(400).json({
        message: "provide email,name,password",
        error: true,
        success: false
      })
    }

     user = await UserModel.findOne({ email:email })

    if(user){
      return response.json({
        message: "This email is already Registered",
        error: true,
        success: false
      })
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password,salt);

    user = new UserModel({
      email: email,
      password: hashPassword,
      name: name,
      otp: verifyCode,
      otpExpires: Date.now() + 600000
    });

    await user.save();

     await sendEmailFun({
      sendTo: email,
      subject: "Verify Email from KashmirBuy.com",
      text: "",
      html: VerificationEmail(name, verifyCode)
    })

    const token = jwt.sign(
       { email: user.email, id: user._id},
       process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    return response.status(200).json({
         success: true,
         error: false,
         message: "User registered successfully! Please verify your email",
         token: token,
    });


  } catch (error){
     return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
     })
  }
}

export async function verifyEmailController(request,response){
  try {
    const { email, otp } = request.body;

    const user = await UserModel.findOne({ email:email })
    if(!user){
      return response.status(400).json({
         error: true,
         success: false,
         message: "User not found"
        });
    }

    const isCodeValid = user.otp === otp;
    const isNotExpired = user.otpExpires > Date.now();

    if(isCodeValid && isNotExpired){
      user.verify_email = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return response.status(200).json({
        error: false,
        success: true,
        message: "Email Verified Successfully"
      });
    }else if(!isCodeValid){
      return response.status(400).json({
        error: true,
        success: false,
        message: "Invailed OTP"
      })
    }else{
      return response.status(400).json({
        error: true,
        success: false,
        message: "OTP expire"
      })
    }
    
  } catch (error) {
    return response.status(500).json({
       message: error.message || error,
       error: true,
       success: false
    })
  }
}

export async function loginUserController(request, response){
   try {

    const {email, password} = request.body;

   const user = await UserModel.findOne({email:email})

   if(!user){
     return response.status(400).json({
      message: "User not register",
      error: true,
      success: false
     })
   }

   if(user.status !== "Active"){
     return response.status(400).json({
      message: "Contact to admin",
      error: true,
      success: false
     })
   }

   if(user.verify_email !== true){
     return response.status(400).json({
      message: "Your Email is not verify yet please verify your email",
      error: true,
      success: false
     })
   }

   const checkPassword = await bcryptjs.compare(password, user.password);

   if(!checkPassword){
     return response.status(400).json({
       message: "Check your password",
       error: true,
       success: false
     })
   }

    const accesstoken = await generetedAccessToken(user._id);
    const refreshToken = await generetedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
      last_login_date: new Date()
    })

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }

    response.cookie('accessToken',accesstoken,cookiesOption)
    response.cookie('refreshToken',refreshToken,cookiesOption)

    return response.json({
      message: "Login successfully",
      error: false,
      success: true,
      data: {
        accesstoken,
        refreshToken
      }
    })
    
   } catch (error) {
       return response.status(500).json({
          message: error.message || error,
          error: true,
          success: false
       })
   }
}

export async function logoutController(request, response){
  try {

    const userid = request.userId

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }

    response.clearCookie('accessToken',cookiesOption)
    response.clearCookie('refreshToken',cookiesOption)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
      refresh_token : ""
    })

    return response.json({
      message: "Logout successfully",
      error: false,
      success: true
    })

    
  } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      })
  }
}

// export async function userAvatarController(request, response) {
//   try {
//     const userId = request.userId;
//     const files = request.files;

//     if (!files || files.length === 0) {
//       return response.status(400).json({ message: "No files uploaded" });
//     }

//     // 1. Get current user data
//     const user = await UserModel.findById(userId);

//     // 2. Delete old avatar from Cloudinary (if exists)
//     if (user?.avatar) {
//       const urlArr = user.avatar.split("/");
//       const imageWithExtension = urlArr[urlArr.length - 1]; // e.g., 1755338015468_20201210_120127.jpg
//       const publicId = `avatars/${imageWithExtension.split(".")[0]}`; // folder + filename without extension

//       await cloudinary.uploader.destroy(publicId);
//     }

//     let uploadedImage = null;

//     // 3. Upload new avatar
//     for (const file of files) {
//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: "avatars", // keep organized
//         use_filename: true,
//         unique_filename: false,
//         overwrite: true,
//       });

//       uploadedImage = result.secure_url;

//       // Delete local file after upload
//       fs.unlinkSync(file.path);
//     }

//     // 4. Update DB with new avatar URL
//     const updatedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       { avatar: uploadedImage },
//       { new: true }
//     ).select("avatar _id name email");

//     return response.status(200).json(updatedUser);

//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// }

// new

export async function userAvatarController(request, response) {
  try {
    const userId = request.userId;
    const { avatar } = request.body; // Cloudinary URL

    if (!avatar) {
      return response.status(400).json({
        success: false,
        message: "Avatar URL is required",
      });
    }

    // get user
    const user = await UserModel.findById(userId);

    // delete old avatar from cloudinary (if exists)
    if (user?.avatar) {
      const parts = user.avatar.split("/");
      const imageName = parts.pop().split(".")[0];
      const folder = parts.pop();
      const publicId = `${folder}/${imageName}`;
      await cloudinary.uploader.destroy(publicId);
    }

    // save new avatar
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    ).select("avatar name email");

    return response.status(200).json({
      success: true,
      avatar: updatedUser.avatar,
    });

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function removeImageFromCloudinary(request, response) {
  try {
    const imgUrl = request.query.img;
    if (!imgUrl) {
      return response.status(400).json({ message: "Image URL required" });
    }

    const parts = imgUrl.split("/");
    const imageName = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2]; // handles /avatars/file.jpg
    const publicId = `${folder}/${imageName}`;

    const result = await cloudinary.uploader.destroy(publicId);

    // remove from user avatar in DB
    await UserModel.findByIdAndUpdate(request.userId, { avatar: "" });

    return response.status(200).json({
      success: true,
      message: "Image deleted successfully",
      result
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function updateUserDetails(request, response){
  try {
    const userId = request.userId
    const { name, email, mobile, password } = request.body;

    const userExist = await UserModel.findById(userId);

    if(!userExist)
      return response.status(400).send('The User cannot be Updated!')


    let verifyCode = "";

    if(email !== userExist.email){
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    let hashPassword = ""

    if (password){
      const salt = await bcryptjs.genSalt(10)
      hashPassword = await bcryptjs.hash(password, salt)
    }else{
      hashPassword = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
         name: name,
         mobile: mobile,
         email: email,
         verify_email: email !== userExist.email ? false : true,
         password: hashPassword,
         otp: verifyCode !== "" ? verifyCode : null,
         otpExpires: verifyCode !== "" ? Date.now() + 600000 : ''
      },
      {
        new: true
      }
    )

    if(email !== userExist.email){
       await sendEmailFun({
      sendTo: email,
      subject: "Verify email from zayro",
      text: "",
      html: VerificationEmail(name, verifyCode)
    })
    }
     
    return response.json({
      message: "User Updated Successfully",
      error: false,
      success: true,
      user: {
         name: updateUser?.name,
         _id: updateUser?._d,
         email: updateUser?.email,
         mobile: updateUser?.mobile,
         avatar: updateUser?.avatar,

      }
    })
    

  } catch (error) {
      return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email not found",
        error: true,
        success: false,
      });
    }

    // Generate OTP
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user with OTP
    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,  // ✅ fixed
      {
        otp: verifyCode,
        otpExpires: Date.now() + 600000, // 10 min expiry
      },
      { new: true }
    );

    if (!updateUser) {
      return response.status(400).json({
        message: "Failed to set OTP. Please try again.",
        error: true,
        success: false,
      });
    }

    // Send email
    await sendEmailFun({
      sendTo: email,
      subject: "Password Reset Code from KashmirBuy.com",
      text: "",
      html: VerificationEmail(user.name, verifyCode),
    });

    return response.json({
      message: "OTP sent to your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide required fields: email, otp",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false
      });
    }

    if (otp !== user.otp) {
      return response.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false
      });
    }

    const currentTime = Date.now();
    if (user.otpExpires < currentTime) {
      return response.status(400).json({
        message: "OTP is expired",
        error: true,
        success: false
      });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return response.status(200).json({
      message: "OTP Verified Successfully",
      error: false,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function resetPasswordController(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body;

    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "Provide required fields: email, newPassword, confirmPassword",
        error: true,
        success: false
      });
    }

     if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return response.status(400).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    // Update password and clear OTP
    user.password = hashPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return response.status(200).json({
      message: "Password reset successfully",
      error: false,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function refreshToken(request, response){
  try {

    const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]

    if(!refreshToken){
      return response.status(401).json({
        message: "Invalid Token",
      error: true,
      success : false
    
      })

    }

    const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

    if(!verifyToken){
      return response.status(400).json({
        message: "token is expired",
        error: true,
        success: false
      })
    }
      
    const userId = verifyToken?._id;
    const newAccessToken = await generetedAccessToken(userId)

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }
    
    response.cookie('accessToken',newAccessToken,cookiesOption)

    return response.json({
       message: "new Access token gennerated",
       error: false,
       succcess: true,
       data: {
        accesstoken : newAccessToken
       }
    } )

  } catch (error) {
      return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}
    
export async function userDetails(request, response) {
  try {
    const userId = request.userId;

    const user = await UserModel.findById(userId)
      .select('-password -refresh_token')
      .populate("address_details");  // ✅ populate addresses

    return response.status(200).json({
      message: 'user details',
      data: user,
      error: false,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: "something went wrong",
      error: true,
      success: false
    });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

