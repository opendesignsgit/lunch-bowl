import requests from "./httpServices";

const EmailService = {
  sendFreeTrialEmail: async (body) => {
    // The full API path used directly in requests.post
    return requests.post("/admin/free-trial-enquiry", body);
  },

  sendSchoolEnquiryEmail: async (body) => {
    console.log("EmailService - Sending school enquiry email with body:", body);

    return requests.post("/admin/get-school-enquiry", body);
  },
};

export default EmailService;
