import razorpayInstance from "../config/razorpay.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // ❌ Amount missing
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    // 🔴 MINIMUM ORDER AMOUNT CHECK (BACKEND ONLY)
    if (amount < 150) {
      return res.status(400).json({
        success: false,
        message: "Minimum order amount is ₹150",
      });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);

    return res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};














// import razorpayInstance from "../config/razorpay.js";

// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).json({
//         success: false,
//         message: "Amount is required",
//       });
//     }

//     const options = {
//       amount: amount * 100, // convert to paise
//       currency: "INR",
//       receipt: "receipt_" + Date.now(),
//     };

//     const order = await razorpayInstance.orders.create(options);

//     return res.json({
//       success: true,
//       data: order,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
