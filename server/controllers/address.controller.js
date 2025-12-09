// import AddressModel  from "../models/address.model.js";
// import UserModel from "../models/user.model.js";

// export const addAddressController = async (request, response) => {

//   try {

//     const {address_line, city, state, pincode, country, mobile, status, userId} = request.body;


//     // if(!address_line || !city || !state || !pincode || !country || !mobile){
//     //    return response.state(500).json({
//     //    message: "Please provide all the fields",
//     //    error: true,
//     //    success: false
//     //   })
//     // }

//     const address = new AddressModel({
//       address_line, city, state, pincode, country, mobile, status, userId
//     })

//     const savedAddress = await address.save();

//     const updateCartUser = await UserModel.updateOne({_id: userId},{
//       $push:{
//         address_details: savedAddress?._id
//       }
//     })

//     return response.status(200).json({
//       data: savedAddress,
//       message: "Address Added successfullay",
//       error: false,
//       success: true
//     })
    
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false
//     })
//   }

// }

// export const getAddressController = async (request, response) => {
//    try {

//     const address = await AddressModel.find({userId:request?.query?.userId});

//     if(!address){
//        return response.status(500).json({
//         message: "Address not Found",
//         error: true,
//         success: false
//        })
//     }

//     return response.status(200).json({
//       error: false,
//       success: true,
//       address: address
//     })
    
//    } catch (error) {
//       return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false
//     })
//    }
// }


import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
  try {
    const { address_line, city, state, pincode, country, mobile, status, userId } = request.body;

    if (!address_line || !city || !state || !pincode || !country || !mobile || !userId) {
      return response.status(400).json({
        message: "Please provide all the fields",
        error: true,
        success: false
      });
    }

    const address = new AddressModel({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId
    });

    const savedAddress = await address.save();

    await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          address_details: savedAddress._id
        }
      }
    );

    return response.status(200).json({
      data: savedAddress,
      message: "Address added successfully",
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
};


export const getAddressController = async (request, response) => {
  try {
    const { userId } = request.query;

    if (!userId) {
      return response.status(400).json({
        message: "UserId is required",
        error: true,
        success: false
      });
    }

    const addresses = await AddressModel.find({ userId });

    if (addresses.length === 0) {
      return response.status(404).json({
        message: "No addresses found for this user",
        error: true,
        success: false
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      address: addresses
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};


export const deleteAddressController = async (request, response) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        message: "Address ID is required",
        error: true,
        success: false
      });
    }

    const deleted = await AddressModel.findByIdAndDelete(id);

    if (!deleted) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false
      });
    }

    // 🧹 Optional: remove reference from user's address_details array
    await UserModel.updateOne(
      { _id: deleted.userId },
      { $pull: { address_details: deleted._id } }
    );

    return response.status(200).json({
      message: "Address deleted successfully",
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
};
