const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const {
  signInToken,
  tokenForVerify,
  handleEncryptData,
} = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const Admin = require("../models/Admin");
const School = require("../models/School");
const Holiday = require("../models/holidaySchema");
const nodemailer = require("nodemailer");
const Customer = require("../models/Customer");
const { sendSMS } = require("../lib/sms-sender/smsService");
const SmsLog = require("../models/SmsLog");

const registerAdmin = async (req, res) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password),
      });
      const staff = await newStaff.save();
      const token = signInToken(staff);
      res.send({
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
      if (admin?.status === "Inactive") {
        return res.status(403).send({
          message:
            "Sorry, you don't have the access right now, please contact with Super Admin.",
        });
      }
      const token = signInToken(admin);

      const { data, iv } = handleEncryptData([
        ...admin?.access_list,
        admin.role,
      ]);
      res.send({
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        iv,
        data,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Admin.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
    return res.status(404).send({
      message: "Admin/Staff Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: `<h2>Hello ${req.body.verifyEmail}</h2>
      <p>A request has been received to change the password for your <strong>lunchBowl</strong> account </p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${process.env.ADMIN_URL}/auth/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>

        
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@lunchBowl.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>lunchBowl Team</strong>
             `,
    };
    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const staff = await Admin.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        staff.password = bcrypt.hashSync(req.body.newPassword);
        staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const addStaff = async (req, res) => {
  // console.log("add staf....", req.body.staffData);
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: { ...req.body.name },
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: req.body.role,
        image: req.body.image,
        access_list: req.body.access_list,
      });
      await newStaff.save();
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};

const getAllStaff = async (req, res) => {
  // console.log('allamdin')
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    res.send(admins);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });

    if (admin) {
      admin.name = { ...admin.name, ...req.body.name };
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.access_list = req.body.access_list;
      admin.joiningData = req.body.joiningDate;
      // admin.password =
      //   req.body.password !== undefined
      //     ? bcrypt.hashSync(req.body.password)
      //     : admin.password;

      admin.image = req.body.image;
      const updatedAdmin = await admin.save();
      const token = signInToken(updatedAdmin);

      const { data, iv } = handleEncryptData([
        ...updatedAdmin?.access_list,
        updatedAdmin.role,
      ]);
      res.send({
        token,
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        image: updatedAdmin.image,
        data,
        iv,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteStaff = (req, res) => {
  Admin.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Admin Deleted Successfully!",
      });
    }
  });
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Staff ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addSchool = async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();
    res.status(201).json({
      success: true,
      message: "School created successfully",
      data: school,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find({});
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update school
// @route   PUT /api/schools/update-school/:id
// @access  Private/Admin
const updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(201).json({
      success: true,
      message: "School created successfully",
      data: school,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete school
// @route   DELETE /api/schools/delete-school/:id
// @access  Private/Admin
const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json({ message: "School removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a holiday
// @route   POST /api/holidays/add-holiday
// @access  Private/Admin
const addHoliday = async (req, res) => {
  try {
    const { date, name } = req.body;

    // Check if holiday already exists for this date
    const existingHoliday = await Holiday.findOne({ date });
    if (existingHoliday) {
      return res.status(400).json({
        success: false,
        message: "Holiday already exists for this date",
      });
    }

    const holiday = new Holiday({ date, name });
    await holiday.save();

    res.status(201).json({
      success: true,
      message: "Holiday created successfully",
      data: holiday,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all holidays
// @route   GET /api/holidays/get-all-holidays
// @access  Public
const getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find({}).sort({ date: 1 });
    res.json({
      success: true,
      data: holidays,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update holiday
// @route   PUT /api/holidays/update-holiday/:id
// @access  Private/Admin
const updateHoliday = async (req, res) => {
  try {
    const { date, name } = req.body;
    const holiday = await Holiday.findById(req.params.id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    // Check if date is being changed and if new date already exists
    if (date && holiday.date.toString() !== new Date(date).toString()) {
      const existingHoliday = await Holiday.findOne({ date });
      if (existingHoliday) {
        return res.status(400).json({
          success: false,
          message: "Holiday already exists for this date",
        });
      }
    }

    holiday.date = date || holiday.date;
    holiday.name = name || holiday.name;
    const updatedHoliday = await holiday.save();

    res.status(200).json({
      success: true,
      message: "Holiday updated successfully",
      data: updatedHoliday,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete holiday
// @route   DELETE /api/holidays/delete-holiday/:id
// @access  Private/Admin
const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }
    res.json({
      success: true,
      message: "Holiday removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sendSchoolEnquiryMail = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      schoolName,
      message,
      email,
      address,
      userId,
    } = req.body;

    // Is this a free trial?
    const isFreeTrial = schoolName === "Free Trial";
    let _id = userId;

    // If it's a free trial, update customer with freeTrial: true
    if (isFreeTrial && email) {
      // Update existing customer or create new one if needed
      await Customer.findOneAndUpdate(
        { _id },
        { freeTrial: true, email, firstName, lastName, mobileNumber },
        { upsert: true, new: true }
      );
    }

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const enquiryType = isFreeTrial
      ? "Free Trial"
      : schoolName === "Nutrition Enquiry"
      ? "Nutrition"
      : "School Service";

    const subject = isFreeTrial
      ? `New Free Trial Request from ${firstName} ${lastName}`
      : `New ${enquiryType} Enquiry from ${firstName} ${lastName}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "shivarex.c@gmail.com, maniyarasanodi20@gmail.com",
      subject,
      html: `
        <h2>${enquiryType} Enquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
        ${address ? `<p><strong>Address:</strong> ${address}</p>` : ""}
        ${
          !isFreeTrial && schoolName && schoolName !== "Nutrition Enquiry"
            ? `<p><strong>School Name:</strong> ${schoolName}</p>`
            : ""
        }
        <p><strong>Message:</strong> ${
          message || "No additional message provided"
        }</p>
        ${isFreeTrial ? "<p>This is a Free Trial enquiry.</p>" : ""}
        <br>
        <p>This enquiry was submitted through the website contact form.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send SMS confirmation for free trial requests
    if (isFreeTrial && mobileNumber) {
      try {
        const date = new Date().toLocaleDateString('en-IN');
        const location = "as per your preference"; // This could be dynamic based on school/location
        const childName = `${firstName}'s child`; // Generic since child name might not be available
        
        const smsResult = await sendSMS(mobileNumber, 'TRIAL_FOOD_CONFIRMATION', [childName, date, location]);
        
        // Log SMS
        const smsLog = new SmsLog({
          mobile: mobileNumber,
          messageType: 'TRIAL_FOOD_CONFIRMATION',
          message: smsResult.message || '',
          templateId: smsResult.templateId || '',
          messageId: smsResult.messageId || '',
          status: smsResult.success ? 'sent' : 'failed',
          error: smsResult.error || undefined,
          customerId: _id,
          variables: [childName, date, location],
          sentAt: new Date()
        });
        
        await smsLog.save();
        console.log('Trial food confirmation SMS sent to:', mobileNumber);
      } catch (smsError) {
        console.error('Error sending trial food confirmation SMS:', smsError);
        // Don't fail the enquiry process if SMS fails
      }
    }

    res.status(200).json({
      success: true,
      message: isFreeTrial
        ? "Free trial request submitted successfully. We will contact you soon."
        : "Enquiry submitted successfully. We will contact you soon.",
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


const talkNutrition = async (req, res) => {
  const { firstName, lastName, mobileNumber, schoolName, message, email } = req.body;

  // Setup transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Compose the email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "csivarex.odi@gmail.com",
    subject: "New Nutrition Enquiry Received",
    html: `
      <h2>Nutrition Enquiry Details</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobileNumber}</p>
      <p><strong>School Name:</strong> ${schoolName}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Nutrition enquiry email sent successfully--------->", mailOptions);

    res.status(200).json({ success: true, message: "Enquiry sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
};

const freeTrialEnquiry = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    address,
    schoolName,
    className,
    message,
    userId,
  } = req.body;

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your gmail address
      pass: process.env.EMAIL_PASS, // your gmail app password
    },
  });

  // Compose email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "shivarex.c@gmail.com",
    subject: "New Free Trial Enquiry",
    html: `
      <h2>Free Trial Enquiry Received</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>School:</strong> ${schoolName}</p>
      <p><strong>Class:</strong> ${className}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>UserId:</strong> ${userId}</p>
      <p><strong>Mobile Number:</strong> ${mobileNumber || "N/A"}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Enquiry sent!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  addSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
  addHoliday,
  getAllHolidays,
  updateHoliday,
  deleteHoliday,
  sendSchoolEnquiryMail,
  talkNutrition,
  freeTrialEnquiry,
};
