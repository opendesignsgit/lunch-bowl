import { useState } from "react";
import EmailService from "@services/EmailService";

const useEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (emailData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await EmailService.sendFreeTrialEmail(emailData);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to send email");
      setLoading(false);
      throw err;
    }
  };

  const sendSchoolEnquiryEmail = async (emailData) => {
    setLoading(true);
    setError(null);
    console.log("Sending school enquiry email with data:", emailData);

    try {
      const response = await EmailService.sendSchoolEnquiryEmail(emailData);
      console.log("School enquiry response:", response);

      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to send school enquiry");
      setLoading(false);
      throw err;
    }
  };

  return { sendEmail, sendSchoolEnquiryEmail, loading, error };
};

export default useEmail;
