const Customer = require("../../models/Customer");
const School = require("../../models/School");
const Dish = require("../../models/DishSchema");

exports.getCustomerHome = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await Customer.findById(userId);

    const banners = [
      { id: 1, image: "https://cdn.yourdomain.com/banners/banner5.png" },
      { id: 2, image: "https://cdn.yourdomain.com/banners/banner2.png" },
    ];

    const highlights = [
      {
        id: "1",
        title: "Healthy",
        description: "Relax and stretch your muscles.",
        icon: "https://cdn.yourdomain.com/icons/healthy.png",
        color: "#FFEBEE",
      },
      {
        id: "2",
        title: "Diet Plan",
        description: "Eat healthy, stay healthy.",
        icon: "https://cdn.yourdomain.com/icons/diet.png",
        color: "#E8F5E9",
      },
      {
        id: "3",
        title: "Flexible Plans",
        description: "Choose what works for you.",
        icon: "https://cdn.yourdomain.com/icons/calendar.png",
        color: "#E3F2FD",
      },
      {
        id: "4",
        title: "Sleep Tracker",
        description: "Track your sleep schedule.",
        icon: "https://cdn.yourdomain.com/icons/sleep.png",
        color: "#F3E5F5",
      },
    ];

    const schools = await School.find().lean();
    const schoolData = schools.map((school, index) => ({
      id: school._id,
      name: school.name,
      icon: `https://cdn.yourdomain.com/schools/${index + 1}.png`,
    }));

    const popularMenus = await Dish.find({ status: "active" })
      .limit(3)
      .select("primaryDishTitle shortDescription image")
      .lean();

    const formattedMenus = popularMenus.map((dish, index) => ({
      id: dish._id,
      name: dish.primaryDishTitle,
      description: dish.shortDescription,
      image: `https://cdn.yourdomain.com/menus/${dish.image}`,
    }));

    const quickActions = [
      { title: "View Plans", action: "navigate_to_plans" },
      { title: "Contact Support", action: "open_support" },
    ];

    return res.status(200).json({
      freeTrial: user?.freeTrial || false,
      banners,
      highlights,
      schools: schoolData,
      popularMenus: formattedMenus,
      quickActions,
    });
  } catch (error) {
    console.error("Home API Error:", error);
    return res.status(500).json({ error: "Failed to load homepage data" });
  }
};
