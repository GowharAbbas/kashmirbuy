import CategoryModel from "../models/category.modal.js";
import { v2 as cloudinary } from 'cloudinary';
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

export async function createCategory(request, response) {
    try {
        const category = new CategoryModel({
            name: request.body.name,
            images: imagesArr,
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName,
        });

        const savedCategory = await category.save();

        if (!savedCategory) {
            return response.status(500).json({
                message: "Category not created",
                error: true,
                success: false
            });
        }

        imagesArr = []; // Clear the images array after saving

        return response.status(200).json({
            message: "Category created successfully",
            error: false,
            success: true,
            category: savedCategory
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getCategories(request, response) {
  try {
    const categories = await CategoryModel.find();
    const categoryMap = {};

    categories.forEach(cat => {
      categoryMap[cat._id] = { ...cat._doc, Children: [] };
    });

    const rootCategories = [];

    categories.forEach(cat => {
      if (cat.parentId) {
        if (categoryMap[cat.parentId]) {
          categoryMap[cat.parentId].Children.push(categoryMap[cat._id]);
        }
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    return response.status(200).json({
      error: false,
      success: true,
      data: rootCategories
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function getCategoriesCount(request, response) {
  try {
    const count = await CategoryModel.countDocuments({ parentId: null });

    return response.status(200).json({
      categoryCount: count,
      success: true,
      error: false
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function getSubCategoriesCount(request, response) {
  try {
    const count = await CategoryModel.countDocuments({ parentId: { $ne: null } });

    return response.status(200).json({
      SubCategoryCount: count,
      success: true,
      error: false
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function getCategory(request, response) {
  try {
    const category = await CategoryModel.findById(request.params.id);

    if (!category) {
      return response.status(404).json({
        message: "Category not found",
        error: true,
        success: false
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      category: category
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
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

export async function deleteCategory(request, response) {
  try {
    const category = await CategoryModel.findById(request.params.id);

    if (!category) {
      return response.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    // Delete images of this category
    for (const img of category.images || []) {
      const urlArr = img.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];
      if (imageName) {
        await cloudinary.uploader.destroy(imageName);
      }
    }

    // Delete subcategories and their images
    const subCategories = await CategoryModel.find({ parentId: category._id });

    for (const subCat of subCategories) {
      // Delete third-level subcategories
      const thirdSubCats = await CategoryModel.find({ parentId: subCat._id });

      for (const thirdSub of thirdSubCats) {
        for (const img of thirdSub.images || []) {
          const urlArr = img.split("/");
          const image = urlArr[urlArr.length - 1];
          const imageName = image.split(".")[0];
          if (imageName) {
            await cloudinary.uploader.destroy(imageName);
          }
        }
        await CategoryModel.findByIdAndDelete(thirdSub._id);
      }

      // Delete images of subcategory
      for (const img of subCat.images || []) {
        const urlArr = img.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0];
        if (imageName) {
          await cloudinary.uploader.destroy(imageName);
        }
      }

      await CategoryModel.findByIdAndDelete(subCat._id);
    }

    // Delete main category
    await CategoryModel.findByIdAndDelete(category._id);

    return response.status(200).json({
      message: "Category and its subcategories deleted successfully",
      success: true,
      error: false
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function updateCategory(request, response) {
  try {
    const { id } = request.params;
    const category = await CategoryModel.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Category not found",
        success: false,
        error: true,
      });
    }

    const { name, parentId, parentCatName } = request.body;

    // ✅ 1. Collect existing images sent from frontend
    let frontendImages = [];
    if (request.body.existingImages) {
  if (Array.isArray(request.body.existingImages)) {
    frontendImages = request.body.existingImages;
  } else {
    frontendImages = [request.body.existingImages];
  }
}


    // ✅ 2. Identify and delete removed old images
    const removedImages = category.images.filter(
      (img) => !frontendImages.includes(img)
    );

    for (const imgUrl of removedImages) {
      try {
        const parts = imgUrl.split("/");
        const fileName = parts.pop();
        const publicId = fileName.split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Failed to delete old image:", err.message);
      }
    }

    // ✅ 3. Upload new files (if any)
    if (request.files && request.files.length > 0) {
      for (const file of request.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        });
        frontendImages.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    // ✅ 4. Update category in DB
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      {
        name: name || category.name,
        images: frontendImages,
        parentId: parentId || category.parentId,
        parentCatName: parentCatName || category.parentCatName,
      },
      { new: true }
    ).lean();

    // ✅ 5. Return in correct format for frontend
    return response.status(200).json({
      message: "Category updated successfully",
      success: true,
      error: false,
      data: updatedCategory, // ✅ frontend expects this key
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}








