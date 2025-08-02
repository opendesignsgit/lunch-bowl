const Admin = require("../../models/Admin");
const Customer = require("../../models/Customer");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const Coupon = require("../../models/Coupon");
const School = require("../../models/School");
const Notification = require("../../models/Notification");

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalAdmins,
      totalCustomers,
      totalProducts,
      totalOrders,
      todayOrders,
      activeCoupons,
      totalSchools,
      totalNotifications,
      totalSales,
      latestOrders,
      latestCustomers
    ] = await Promise.all([
      Admin.countDocuments(),
      Customer.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Coupon.countDocuments({ status: "show" }),
      School.countDocuments(),
      Notification.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Customer.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      totalAdmins,
      totalCustomers,
      totalProducts,
      totalOrders,
      todayOrders,
      activeCoupons,
      totalSchools,
      totalNotifications,
      totalSales: totalSales[0]?.total || 0,
      latestOrders,
      latestCustomers
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};
