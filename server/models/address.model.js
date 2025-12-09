// import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   address_line:{
//     type: String,
//     default : ""
//   },
//   city:{
//     type: String,
//     default : ""
//   },
//   state:{
//     type: String,
//     default : ""
//   },
//   pincode:{
//     type: String,
//   },
//   country:{
//     type: String,
//   },
//   mobile:{
//     type: Number,
//     default : null
//   },
//   status:{
//     type: Boolean,
//     default: true
//   },
//   userId:{
//     type: String,
//     default: ""
//   }
// },{
//   Timestamps : true
// })

// const AddressModel = mongoose.model('address',addressSchema)

// export default AddressModel


import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address_line: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    default: null
  },
  status: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,   // better to reference UserModel
    ref: "user",
    required: true
  }
}, {
  timestamps: true   // ✅ correct spelling
});

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;
