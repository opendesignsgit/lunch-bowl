require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const { signInToken, tokenForVerify } = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const {
  customerRegisterBody,
} = require("../lib/email-sender/templates/register");
const {
  forgetPasswordEmailBody,
} = require("../lib/email-sender/templates/forget-password");
const { sendVerificationCode } = require("../lib/phone-verification/sender");
const Otp = require("../models/Otp");
const Form = require("../models/Form");

const verifyEmailAddress = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (isAdded) {
    return res.status(403).send({
      message: "This Email already Added!",
    });
  } else {
    const token = tokenForVerify(req.body);
    const option = {
      name: req.body.name,
      email: req.body.email,
      token: token,
    };
    const body = {
      from: process.env.EMAIL_USER,
      // from: "info@demomailtrap.com",
      to: `${req.body.email}`,
      subject: "Email Activation",
      subject: "Verify Your Email",
      html: customerRegisterBody(option),
    };

    const message = "Please check your email to verify your account!";
    sendEmail(body, res, message);
  }
};

const verifyPhoneNumber = async (req, res) => {
  const phoneNumber = req.body.phone;

  // console.log("verifyPhoneNumber", phoneNumber);

  // Check if phone number is provided and is in the correct format
  if (!phoneNumber) {
    return res.status(400).send({
      message: "Phone number is required.",
    });
  }

  // Optional: Add phone number format validation here (if required)
  // const phoneRegex = /^[0-9]{10}$/; // Basic validation for 10-digit phone numbers
  // if (!phoneRegex.test(phoneNumber)) {
  //   return res.status(400).send({
  //     message: "Invalid phone number format. Please provide a valid number.",
  //   });
  // }

  try {
    // Check if the phone number is already associated with an existing customer
    const isAdded = await Customer.findOne({ phone: phoneNumber });

    if (isAdded) {
      return res.status(403).send({
        message: "This phone number is already added.",
      });
    }

    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Send verification code via SMS
    const sent = await sendVerificationCode(phoneNumber, verificationCode);

    if (!sent) {
      return res.status(500).send({
        message: "Failed to send verification code.",
      });
    }

    const message = "Please check your phone for the verification code!";
    return res.send({ message });
  } catch (err) {
    console.error("Error during phone verification:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const registerCustomer = async (req, res) => {
  const token = req.params.token;

  try {
    const { name, email, password } = jwt.decode(token);

    // Check if the user is already registered
    const isAdded = await Customer.findOne({ email });

    if (isAdded) {
      const token = signInToken(isAdded);
      return res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        password: password,
        message: "Email Already Verified!",
      });
    }

    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET_FOR_VERIFY,
        async (err, decoded) => {
          if (err) {
            return res.status(401).send({
              message: "Token Expired, Please try again!",
            });
          }

          // Create a new user only if not already registered
          const existingUser = await Customer.findOne({ email });
          console.log("existingUser");

          if (existingUser) {
            return res.status(400).send({ message: "User already exists!" });
          } else {
            const newUser = new Customer({
              name,
              email,
              password: bcrypt.hashSync(password),
            });

            await newUser.save();
            const token = signInToken(newUser);
            res.send({
              token,
              _id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              message: "Email Verified, Please Login Now!",
            });
          }
        }
      );
    }
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).send({
      message: "Internal server error. Please try again later.",
    });
  }
};

const addAllCustomers = async (req, res) => {
  try {
    await Customer.deleteMany();
    await Customer.insertMany(req.body);
    res.send({
      message: "Added all users successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const loginCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findOne({ email: req.body.email });

//     // console.log("loginCustomer", req.body.password, "customer", customer);

//     if (
//       customer &&
//       customer.password &&
//       bcrypt.compareSync(req.body.password, customer.password)
//     ) {
//       const token = signInToken(customer);
//       res.send({
//         token,
//         _id: customer._id,
//         name: customer.name,
//         email: customer.email,
//         address: customer.address,
//         phone: customer.phone,
//         image: customer.image,
//       });
//     } else {
//       res.status(401).send({
//         message: "Invalid user or password!",
//         error: "Invalid user or password!",
//       });
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//       error: "Invalid user or password!",
//     });
//   }
// };

const forgetPassword = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (!isAdded) {
    return res.status(404).send({
      message: "User Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const option = {
      name: isAdded.name,
      email: isAdded.email,
      token: token,
    };

    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.email}`,
      subject: "Password Reset",
      html: forgetPasswordEmailBody(option),
    };

    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const customer = await Customer.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        customer.password = bcrypt.hashSync(req.body.newPassword);
        customer.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const changePassword = async (req, res) => {
  try {
    // console.log("changePassword", req.body);
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer.password) {
      return res.status(403).send({
        message:
          "For change password,You need to sign up with email & password!",
      });
    } else if (
      customer &&
      bcrypt.compareSync(req.body.currentPassword, customer.password)
    ) {
      customer.password = bcrypt.hashSync(req.body.newPassword);
      await customer.save();
      res.send({
        message: "Your password change successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithProvider = async (req, res) => {
  try {
    // const { user } = jwt.decode(req.body.params);
    const user = jwt.decode(req.params.token);

    // console.log("user", user);
    const isAdded = await Customer.findOne({ email: user.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        phone: isAdded.phone,
        image: isAdded.image,
      });
    } else {
      const newUser = new Customer({
        name: user.name,
        email: user.email,
        image: user.picture,
      });

      const signUpCustomer = await newUser.save();
      const token = signInToken(signUpCustomer);
      res.send({
        token,
        _id: signUpCustomer._id,
        name: signUpCustomer.name,
        email: signUpCustomer.email,
        image: signUpCustomer.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithOauthProvider = async (req, res) => {
  try {
    // console.log("user", user);
    // console.log("signUpWithOauthProvider", req.body);
    const isAdded = await Customer.findOne({ email: req.body.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        phone: isAdded.phone,
        image: isAdded.image,
      });
    } else {
      const newUser = new Customer({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
      });

      const signUpCustomer = await newUser.save();
      const token = signInToken(signUpCustomer);
      res.send({
        token,
        _id: signUpCustomer._id,
        name: signUpCustomer.name,
        email: signUpCustomer.email,
        image: signUpCustomer.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const users = await Customer.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Shipping address create or update
const addShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    const newShippingAddress = req.body;

    // Find the customer by ID and update the shippingAddress field
    const result = await Customer.updateOne(
      { _id: customerId },
      {
        $set: {
          shippingAddress: newShippingAddress,
        },
      },
      { upsert: true } // Create a new document if no document matches the filter
    );

    if (result.nModified > 0 || result.upserted) {
      return res.send({
        message: "Shipping address added or updated successfully.",
      });
    } else {
      return res.status(404).send({ message: "Customer not found." });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    // const addressId = req.query.id;

    // console.log("getShippingAddress", customerId);
    // console.log("addressId", req.query);

    const customer = await Customer.findById(customerId);
    res.send({ shippingAddress: customer?.shippingAddress });

    // if (addressId) {
    //   // Find the specific address by its ID
    //   const address = customer.shippingAddress.find(
    //     (addr) => addr._id.toString() === addressId.toString()
    //   );

    //   if (!address) {
    //     return res.status(404).send({
    //       message: "Shipping address not found!",
    //     });
    //   }

    //   return res.send({ shippingAddress: address });
    // } else {
    //   res.send({ shippingAddress: customer?.shippingAddress });
    // }
  } catch (err) {
    // console.error("Error adding shipping address:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateShippingAddress = async (req, res) => {
  try {
    const activeDB = req.activeDB;

    const Customer = activeDB.model("Customer", CustomerModel);
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.shippingAddress.push(req.body);

      await customer.save();
      res.send({ message: "Success" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteShippingAddress = async (req, res) => {
  try {
    const activeDB = req.activeDB;
    const { userId, shippingId } = req.params;

    const Customer = activeDB.model("Customer", CustomerModel);
    await Customer.updateOne(
      { _id: userId },
      {
        $pull: {
          shippingAddress: { _id: shippingId },
        },
      }
    );

    res.send({ message: "Shipping Address Deleted Successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    // Validate the input
    const { name, email, address, phone, image } = req.body;

    // Find the customer by ID
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send({
        message: "Customer not found!",
      });
    }

    // Check if the email already exists and does not belong to the current customer
    const existingCustomer = await Customer.findOne({ email });
    if (
      existingCustomer &&
      existingCustomer._id.toString() !== customer._id.toString()
    ) {
      return res.status(400).send({
        message: "Email already exists.",
      });
    }

    // Update customer details
    customer.name = name;
    customer.email = email;
    customer.address = address;
    customer.phone = phone;
    customer.image = image;

    // Save the updated customer
    const updatedUser = await customer.save();

    // Generate a new token
    const token = signInToken(updatedUser);

    // Send the updated customer data with the new token
    res.send({
      token,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
      image: updatedUser.image,
      message: "Customer updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteCustomer = (req, res) => {
  Customer.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "User Deleted Successfully!",
      });
    }
  });
};

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { mobile, path } = req.body;

    if (!mobile)
      return res.status(400).json({ message: "Mobile number is required" });

    // Generate a -digit OTP
    const generateOtp = () =>
      Math.floor(1000 + Math.random() * 9000).toString();
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry

    // Remove any existing OTPs for this mobile number
    await Otp.deleteMany({ mobile });

    // Save the new OTP
    await Otp.create({ mobile, otp, expiresAt });

    // In production: send OTP via SMS service (e.g., Twilio)

    res.status(200).json({ message: "OTP sent successfully", otp, expiresAt }); // remove `otp` in production
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//verify Otp
const verifyOtp = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, otp, path } = req.body;
    console.log("====================================");
    console.log("path---->", path);
    console.log("====================================");
    if (!mobile || !otp) {
      return res
        .status(400)
        .json({ message: "Mobile number and OTP are required" });
    }

    // Find the OTP record for the mobile number
    const existingOtp = await Otp.findOne({ mobile });

    if (!existingOtp) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check if the OTP is correct
    if (existingOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if the OTP has expired (optional — TTL should auto-delete it)
    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // OTP is valid — delete it from DB (optional cleanup)
    await Otp.deleteOne({ mobile });

    // Proceed with login/signup or session creation logic here

    if (path == "signUp-otp") {
      // Check if user already exists
      const existingUser = await Customer.findOne({
        $or: [{ email }, { mobile }],
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Now call createCustomer and return the response
      const result = await createCustomer({
        firstName,
        lastName,
        mobile,
        email,
      });
      return res.status(200).json(result);
    } else {
      const result = await loginCustomer(mobile);
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//create Customer
const createCustomer = async ({ firstName, lastName, mobile, email }) => {
  const newUser = new Customer({
    name: `${firstName} ${lastName}`,
    phone: mobile,
    email,
  });

  await newUser.save();

  const token = signInToken(newUser);

  return {
    success: true,
    token,
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    mobile: newUser.mobile,
    message: "Registration successful!",
  };
};

//logIn Customer
const loginCustomer = async (mobile) => {
  try {
    const customer = await Customer.findOne({ phone: mobile });

    if (customer) {
      const token = signInToken(customer);
      res.send({
        success: true,
        token,
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.mobile,
        message: "Log in successful!",
      });
    } else {
      res.status(401).send({
        message: "Invalid user or password!",
        error: "Invalid user or password!",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: "Login failed",
    };
  }
};

const stepFormRegister = async (req, res) => {
  try {
    const { formData, path, payload, _id } = req.body;

    // Validate required fields
    if (!_id || !path || (!formData && !payload)) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: _id, path, and either formData or payload",
      });
    }

    let update = {};
    if (path === "step-Form-ParentDetails") {
      update = { parentDetails: formData };
    } else if (path === "step-Form-ChildDetails") {
      update = { children: formData };
    } else if (path === "step-Form-SubscriptionPlan") {
      if (
        !payload ||
        !payload.selectedPlan ||
        !payload.startDate ||
        !payload.endDate ||
        !payload.workingDays ||
        !payload.totalPrice
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required subscription plan fields",
        });
      }
      update = {
        subscriptionPlan: {
          planId: payload.selectedPlan,
          startDate: payload.startDate,
          endDate: payload.endDate,
          workingDays: payload.workingDays,
          price: payload.totalPrice,
        },
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid path parameter",
      });
    }

    const form = await Form.findOneAndUpdate(
      { user: _id },
      { $set: update },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    console.error("Error during stepFormRegister:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getMenuCalendarDate = async (req, res) => {
  try {
    const { _id, path } = req.body;
    console.log("====================================", req.body);

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    console.log("====================================");
    console.log("_id", _id);
    console.log("====================================");

    const form = await Form.findOne({ user: _id });
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    // Check if subscriptionPlan exists
    if (!form.subscriptionPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    const { startDate, endDate } = form.subscriptionPlan;

    // Safely map children names
    const childrenNames =
      form.children?.map((child) => ({
        firstName: child.childFirstName,
        lastName: child.childLastName,
      })) || [];

    return res.status(200).json({
      success: true,
      data: {
        startDate,
        endDate,
        children: childrenNames,
      },
    });
  } catch (error) {
    console.error("Error in getMenuCalendarDate:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// const menuCalendar = async (req, res) => {
//   try {
//     const _id = req.params.id;

//     const customer = await Customer.findById(_id);
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     const { startDate, endDate } = form.subscriptionPlan;

//     return res.status(200).json({
//       success: true,
//       data: {
//         startDate,
//         endDate,
//       },
//     });
//   } catch (error) {
//     console.error("Error during stepFormRegister:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  loginCustomer,
  verifyPhoneNumber,
  registerCustomer,
  addAllCustomers,
  signUpWithProvider,
  signUpWithOauthProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  sendOtp,
  verifyOtp,
  stepFormRegister,
  getMenuCalendarDate,
};
