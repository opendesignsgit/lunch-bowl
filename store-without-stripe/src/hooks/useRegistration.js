import CustomerServices from "@services/CustomerServices";
import { useState } from "react";
import { useRouter } from "next/router";

const useRegistration = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async ({ formData, path, payload, _id }) => {
    setLoading(true);

    try {
      if (
        path == "step-Form-ParentDetails" ||
        path == "step-Form-ChildDetails" ||
        path == "step-Form-SubscriptionPlan"
      ) {
        const res = await CustomerServices.stepFormRegister({
          formData,
          path,
          payload,
          _id,
        });
        console.log("Full response------>:", res);
        return res;
      } else if (path == "get-Menu-Calendar") {
        const res = await CustomerServices.getMenuCalendar({ _id, path });
        console.log("Full response------>:", res);
        return res;
      }
    } catch (error) {
      setError(error.message);
      console.error("Error during registration:", error);
    }
  };

  return {
    submitHandler,
  };
};

export default useRegistration;
