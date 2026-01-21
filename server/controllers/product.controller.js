import ProductModel from "../models/product.model.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


// export async function uploadImages(req, res) {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No images uploaded",
//       });
//     }

//     const uploadedImages = [];

//     for (const file of req.files) {
//       const result = await cloudinary.uploader.upload(file.path, {
//         use_filename: true,
//         unique_filename: false,
//         overwrite: false,
//       });

//       uploadedImages.push(result.secure_url);

//       // Delete file from local uploads folder
//       fs.unlinkSync(file.path);
//     }

//     return res.status(200).json({
//       success: true,
//       images: uploadedImages,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Upload failed",
//     });
//   }
// }

// new

export async function uploadImages(req, res) {
  try {
    const { images } = req.body; // Cloudinary URLs array

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images array is required",
      });
    }

    return res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// export async function createProduct(req, res) {
//   try {

//     if (!req.body.images || req.body.images.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Product must have at least one image",
//       });
//     }

//     const product = await ProductModel.create({
//       name: req.body.name,
//       description: req.body.description,
//       images: req.body.images, // 📌 now storing multiple URLs
//       brand: req.body.brand,
//       price: req.body.price,
//       oldPrice: req.body.oldPrice,
//       catName: req.body.catName,
//       catId: req.body.catId,
//       subCat: req.body.subCat,
//       subCatId: req.body.subCatId,
//       thirdSubCat: req.body.thirdSubCat,
//       thirdSubCatId: req.body.thirdSubCatId,
//       parentId: req.body.parentId,
//       // countInStock: req.body.countInStock,
//       rating: req.body.rating,
//       isFeatured: req.body.isFeatured,
//       discount: req.body.discount,
//       // productRam: req.body.productRam,
//       // size: req.body.size,
//       // productWeight: req.body.productWeight,
//     });

//     return res.status(200).json({
//       message: "Product created successfully",
//       success: true,
//       product,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || error,
//     });
//   }
// }

 //new

export async function createProduct(req, res) {
  try {
    if (!req.body.images || req.body.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product must have at least one image",
      });
    }

    const product = await ProductModel.create({
      name: req.body.name,
      description: req.body.description,
      images: req.body.images, // ✅ Cloudinary URLs
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catName: req.body.catName,
      catId: req.body.catId,
      subCat: req.body.subCat,
      subCatId: req.body.subCatId,
      thirdSubCat: req.body.thirdSubCat,
      thirdSubCatId: req.body.thirdSubCatId,
      parentId: req.body.parentId,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
    });

    return res.status(200).json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getAllProducts(request, response){
  try {
    
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false
      });
    }

    

    // const products = await ProductModel.find().populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    const products = await ProductModel.find()
  .sort({ createdAt: -1 }) // 🔥 NEWEST FIRST
  .populate("category")
  .skip((page - 1) * perPage)
  .limit(perPage)
  .exec();


    if(!products){
       response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages : totalPages,
      page : page
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getAllProductsByCatId(request, response){
  try {
    
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false
      });
    }

    

    const products = await ProductModel.find({
      catId: request.params.id
    }).sort({ createdAt: -1 }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    if(!products){
       response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages : totalPages,
      page : page
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getAllProductsByCatName(request, response){
  try {
    
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false
      });
    }

    const products = await ProductModel.find({
      catName: request.query.catName
    }).sort({ createdAt: -1 }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    if(!products){
       response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages : totalPages,
      page : page
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getAllProductsBySubCatId(request, response){
  try {
    
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false
      });
    }

    const products = await ProductModel.find({
      subCatId: request.params.id
    }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    if(!products){
       response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages : totalPages,
      page : page
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getAllProductsBySubCatName(request, response){
  try {
    
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false
      });
    }

    const products = await ProductModel.find({
      subCat: request.query.subCat
    }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    if(!products){
       response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages : totalPages,
      page : page
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getAllProductsByThirSubdCatId(request, response){
  try {
    
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false
      });
    }

    const products = await ProductModel.find({
      thirdSubCatId: request.params.id
    }).sort({ createdAt: -1 }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    if(!products){
       response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages : totalPages,
      page : page
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getAllProductsByThirdSubCatName(request, response){
  try {
    
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false
      });
    }

    const products = await ProductModel.find({
      thirdSubCat: request.query.thirdSubCat
    }).sort({ createdAt: -1 }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    if(!products){
       response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages : totalPages,
      page : page
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getAllProductsByPrice(request, response){
    let productList = [];

    if(request.query.catId !== "" && request.query.catId !== undefined){
       const productListArr = await ProductModel.find({
          catId: request.query.catId,
       }).populate("category");

       productList = productListArr;
    }

   
    if(request.query.subCatId !== "" && request.query.subCatId !== undefined){
       const productListArr = await ProductModel.find({
          subCatId: request.query.subCatId,
       }).populate("category");

       productList = productListArr;
    }


    if(request.query.thirdSubCatId !== "" && request.query.thirdSubCatId !== undefined){
       const productListArr = await ProductModel.find({
          thirdSubCatId: request.query.thirdSubCatId,
       }).populate("category");

       productList = productListArr;
    }

    const filteredProducts = productList.filter((product) =>{
        if(Request.query.minPrice && product.price < parseInt(+ request.query.minPrice)){
          return false;
        }
        if(request.query.maxPrice && product.price > parseInt(+ request.query.maxPrice)){
          return false;
        }
        return true;
    });

    return response.status(200).json({
      error: false,
      success: true,
      products: filteredProducts,
      totalPages: 0,
      page: 0
    });

}

export async function getAllProductsByRating(request, response){
  try {
    
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > totalPages){
      return response.status(404).json({
        message: "Page not found",
        error: true,
        success: false
      });
    }

    let products = [];

    if(request.query.catId !== undefined){

      products = await ProductModel.find({
        rating: request.query.rating,
        catId: request.body.catId,

    }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    }



    if(request.query.subCatId !== undefined){

      products = await ProductModel.find({
         rating: request.query.rating,
         subCatId: request.body.subCatId,

    }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    }


    if(request.query.thirdSubCatId !== undefined){

      products = await ProductModel.find({
        rating: request.query.rating,
        thirdSubCatId: request.body.thirdSubCatId

    }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

    }

    

    if(!products){
    return  response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages : totalPages,
      page : page
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function getProductsCount(request, response) {
   try {
     const productsCount = await ProductModel.countDocuments();

     if(!productsCount){
        response.status(500).json({
          error: true,
          success: false
        })
     }

     return response.status(200).json({
       error: false,
       success: true,
       productsCount: productsCount
     })
   } catch (error) {
       return response.status(500).json({
       message: error.message || error,
       error: true,
       success: false
    })
   }
}

export async function getAllFeaturedProducts(request, response){
  try {
    
    const products = await ProductModel.find({
         isFeatured: true
    }).populate("category");

    if(!products){
     return  response.status(500).json({
         error: true,
         success: false
       })
    }

    return response.status(200).json({
      error: false,
      success: true,
      products: products,
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export async function deleteProduct(request, response){
    const product = await ProductModel.findById(request.params.id).populate("category");

    if(!product){
        return response.status(404).json({
            message: "Product Not Found",
            error: true,
            success: false
        })
    }

    const images = product.images;

    let img = "";
    for(img of images){
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length -1];

      const imageName = image.split(".")[0];

      if(imageName){
        cloudinary.uploader.destroy(imageName, (error, result) =>{

        });
      }

    }

    const deletedProduct = await ProductModel.findByIdAndDelete(request.params.id);

    if(!deletedProduct){
       return response.status(404).json({
         message: "Product not deleted",
         success: false,
         error: true
       });
    }

    return response.status(200).json({
         message: "Product deleted",
         success: true,
         error: false
       });
}

export async function getProduct(request, response){
   try {

      const product = await ProductModel.findById(request.params.id).populate("category");

      if(!product){
        return response.status(500).json({
          message: "product not found",
          error: true,
          success: false
        })
      }

      return response.status(200).json({
        error: false,
        success: true,
        product: product
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

// export async function updateProduct(request, response){
//   try {

//     const product = await ProductModel.findByIdAndUpdate(
//        request.params.id,
//        {
//          name: request.body.name,
//          description: request.body.description,
//          images: request.body.images,
//          brand: request.body.brand,
//          price: request.body.price,
//          oldPrice: request.body.oldPrice,
//          category: request.body.category,
//          catName: request.body.catName,
//          catId: request.body.catId,
//          subCat: request.body.subCat,
//          subCatId: request.body.subCatId,
//          thirdSubCat: request.body.thirdSubCat,
//          thirdSubCatId: request.body.thirdSubCatId,
//          parentId: request.body.parentId,
//          countInStock: request.body.countInStock,
//          rating: request.body.rating,
//          isFeatured: request.body.isFeatured,
//          discount: request.body.discount,
//          productRam: request.body.productRam,
//          size: request.body.size,
//          productWeight: request.body.productWeight,
         
//        },
//        {new: true}
//     );

//      if(!product){
//        response.status(404).json({
//           message: "product can not be updated",
//           status: false
//        })
//      }

//      imagesArr = [];

//      return response.status(200).json({
//         message: "product is updated",
//         error: false,
//         success: true
//      })

//      return 
    
//   } catch (error) {
//      return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false
//     });
//   }
// }

// new

export async function updateProduct(req, res) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body, // includes images array
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function searchProduct(req, res) {
  try {
    const query = req.params.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Split text into separate search words
    const words = query.trim().split(/\s+/);

    // Build regex array — one regex per word
    const regexQueries = words.map((word) => ({
      name: { $regex: word, $options: "i" },
    }));

    const products = await ProductModel.find({
      $and: regexQueries, // ALL words must match somewhere
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

export async function getLatestProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;

    // Try sort by timestamps (createdAt)
    let products = await ProductModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // If DB has no createdAt values → fallback using _id timestamp
    if (!products || products.length === 0) {
      products = await ProductModel.find({})
        .sort({ _id: -1 })
        .limit(limit)
        .lean();
    }

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest products",
      error: error.message,
    });
  }
}













