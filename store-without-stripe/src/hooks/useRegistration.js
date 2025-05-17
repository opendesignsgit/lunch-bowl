import CustomerServices from "@services/CustomerServices";
import { useState } from "react";
import { useRouter } from "next/router";

const useRegistration = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async ({ formData, path, payload, _id, data }) => {
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
        return res;
      } else if (path == "get-Menu-Calendar") {
        const res = await CustomerServices.getMenuCalendar({ _id, path });
        return res;
      } else if (path == "save-meals") {
        const res = await CustomerServices.saveMenuCalendar({
          _id,
          path,
          data,
        });
        return res;
      }else if (path == "get-saved-meals") {
        const res = await CustomerServices.getSavedMeals({
          _id,
          path,
        });
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
