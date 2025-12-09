import PDFDocument from "pdfkit";
import OrderModel from "../models/order.model.js";

export const generateInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${orderId}.pdf`);

    doc.pipe(res);

    // HEADER
    doc.fontSize(22).text("KashmirBuy.com", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(14).text("Customer Invoice", { align: "center" });
    doc.moveDown(1);

    // ORDER DETAILS
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Payment ID: ${order.razorpay_payment_id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown(1);

    // CUSTOMER DETAILS
    doc.fontSize(14).text("Customer Details:", { underline: true });
    doc.fontSize(12).text(`Name: ${order.delivery_address.fullName}`);
    doc.text(`Email: ${order.delivery_address.email}`);
    doc.text(`Phone: ${order.delivery_address.mobile}`);
    doc.text(
      `Address: ${order.delivery_address.address_line}, ${order.delivery_address.city}, ${order.delivery_address.state} - ${order.delivery_address.pincode}`
    );
    doc.text(`Country: ${order.delivery_address.country}`);
    doc.moveDown(1);

    // PRODUCT TABLE
    doc.fontSize(14).text("Products:", { underline: true });
    doc.moveDown(0.5);

    order.products.forEach((p) => {
      doc.fontSize(12).text(`${p.name}`);
      doc.text(`Qty: ${p.qty} × ₹${p.price}`);
      doc.text(`Subtotal: ₹${p.qty * p.price}`);
      doc.moveDown(0.5);
    });

    doc.moveDown(1);

    // FINAL AMOUNT
    doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, { bold: true });

    doc.moveDown(2);

    // 📌 PROFESSIONAL FOOTER NOTE
    doc
      .fontSize(11)
      .fillColor("red")
      .text(
        "Important Note:",
        { underline: true }
      );

    doc
      .fontSize(11)
      .fillColor("black")
      .text(
        "For any issues related to your order, refund assistance, or support, please contact our customer care at: +91 9149899920",
        { lineGap: 4 }
      );

    doc
      .fontSize(11)
      .text(
        "Please ensure that you return this invoice along with the product in case of return.",
        { lineGap: 4 }
      );

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Invoice error" });
  }
};

