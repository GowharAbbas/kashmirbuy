import HomeSliderModel from "../models/homeSlider.js";
import { v2 as cloudinary } from 'cloudinary';
import { error } from "console";
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


var imagesArr = [];

export async function uploadImages(request, response) {
    try {
        imagesArr = [];

        const files = request.files;

        if (!files || files.length === 0) {
            return response.status(400).json({
                message: "No files uploaded",
                error: true,
                success: false
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < files.length; i++) {
            const result = await cloudinary.uploader.upload(files[i].path, options);
            imagesArr.push(result.secure_url);

            fs.unlinkSync(files[i].path);
        }

        return response.status(200).json({
            message: "Images uploaded successfully",
            images: imagesArr,
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

export async function addHomeSlide(request, response){
  try {

    let slide = new HomeSliderModel({
       images: imagesArr
    })

    if(!slide){
        return response.status(500).json({
            message: "slide not created",
            error: true,
            success: false
        })
    }

    slide = await slide.save();

    imagesArr = [];

    return response.status(200).json({
        message: "Slide Created",
        error: false,
        success: true,
        slide: slide
    })
    
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getHomeSlides(request, response){
    try {

        const slides = await HomeSliderModel.find();
        
        if(!slides){
            return response.status(404).json({
                message: "Slides not Found",
                error: true,
                success: false
            })
        }

       return response.status(200).json({
        error: false,
        success: true,
        data: slides
       })
        
    } catch (error) {
        return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
    }
}

export async function getSlide(request, response){
    try {

        const slide = await HomeSliderModel.findById(request.params.id);
        
        if(!slide){
            return response.status(404).json({
                message: "Slide with given Id not Found",
                error: true,
                success: false
            })
        }

       return response.status(200).json({
        error: false,
        success: true,
        slide: slide
       })
        
    } catch (error) {
        return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
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
    const folder = parts[parts.length - 2]; // handles folders
    const publicId = `${folder}/${imageName}`;

    const result = await cloudinary.uploader.destroy(publicId);

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

export async function deleteSlide(request, response) {
    const slide = await HomeSliderModel.findById(request.params.id);
    const images = slide.images;

    let img="";

    for (img of images){
        const imgUrl = img;
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];

        const imageName = image.split(".")[0];

        if(imageName){
            cloudinary.uploader.destroy(imageName, (error, result) => {

            })
        }
    }

    const deleteSlide = await HomeSliderModel.findByIdAndDelete(request.params.id);
    if(!deleteSlide) {
        request.status(404).json({
            message: "Slide not found",
            success: false,
            error: true
        })
    }

    return response.status(200).json({
        success: true,
        error: false,
        message: " Slide Deleted"
    })
}

