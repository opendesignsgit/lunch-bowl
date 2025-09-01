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

  return { sendEmail, loading, error };
};

export default useEmail;
