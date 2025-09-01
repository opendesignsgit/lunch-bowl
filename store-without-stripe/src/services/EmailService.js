import requests from "./httpServices";

const EmailService = {
  sendFreeTrialEmail: async (body) => {
    // The full API path used directly in requests.post
    return requests.post("/admin/free-trial-enquiry", body);
  },
};

export default EmailService;
