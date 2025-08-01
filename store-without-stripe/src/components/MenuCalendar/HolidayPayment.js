import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import CryptoJS from "crypto-js";
import { useSession } from "next-auth/react";

const HolidayPayment = ({
  open,
  onClose,
  selectedDate,
  childrenData = [],
  onSuccess,
}) => {
  const { data: session } = useSession();
  const _id = session?.user?.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = childrenData.length * 199;
  const orderId = `LB-HOLIDAY-${Date.now()}`;

  const ccavenueConfig = {
    merchant_id: "4381442",
    access_code: "AVRM80MF59BY86MRYB",
    working_key: "2A561B005709D8B4BAF69D049B23546B",
    redirect_url:
      "https://api.lunchbowl.co.in/api/ccavenue/response/holiydayPayment",
    cancel_url: "https://api.lunchbowl.co.in/api/ccavenue/response",
    currency: "INR",
    language: "EN",
    endpoint:
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
  };

  const encrypt = (plainText, workingKey) => {
    const md5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(workingKey));
    const key = CryptoJS.enc.Hex.parse(md5Hash.toString(CryptoJS.enc.Hex));
    const iv = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(plainText),
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return encrypted.ciphertext.toString();
  };

  const initiatePayment = () => {
    if (!_id) {
      setError("User not logged in. Please login to continue.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const paymentData = {
        merchant_id: ccavenueConfig.merchant_id,
        order_id: orderId,
        amount: 1, // or totalAmount.toFixed(2)
        currency: ccavenueConfig.currency,
        redirect_url: ccavenueConfig.redirect_url,
        cancel_url: ccavenueConfig.cancel_url,
        language: ccavenueConfig.language,
        billing_name: "Holiday Meal",
        billing_email: "no-email@lunchbowl.in",
        billing_tel: "0000000000",
        billing_address: "Holiday Meal Booking",
        billing_city: "Chennai",
        billing_state: "TN",
        billing_zip: "600001",
        billing_country: "India",
        merchant_param1: _id, // Corrected here
        merchant_param2: selectedDate,
        merchant_param3: JSON.stringify(childrenData),
        merchant_param4: "HOLIDAY_PAYMENT",
      };

      const plainText = Object.entries(paymentData)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

      const encryptedData = encrypt(plainText, ccavenueConfig.working_key);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = ccavenueConfig.endpoint;
      form.style.display = "none";

      const inputEnc = document.createElement("input");
      inputEnc.type = "hidden";
      inputEnc.name = "encRequest";
      inputEnc.value = encryptedData;
      form.appendChild(inputEnc);

      const inputAccess = document.createElement("input");
      inputAccess.type = "hidden";
      inputAccess.name = "access_code";
      inputAccess.value = ccavenueConfig.access_code;
      form.appendChild(inputAccess);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Holiday Payment</DialogTitle>
      <DialogContent dividers>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        <Typography gutterBottom>
          You're booking <b>{childrenData.length}</b> meal
          {childrenData.length > 1 ? "s" : ""} for <b>{selectedDate}</b>.
        </Typography>
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          Total: ₹{totalAmount}
        </Typography>
        {error && (
          <Typography color="error" fontSize="0.85rem">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={initiatePayment}
          sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea620a" } }}
          disabled={loading}
        >
          Pay ₹{totalAmount}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HolidayPayment;
