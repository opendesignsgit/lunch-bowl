import CustomerServices from "@services/CustomerServices";
import { useState } from "react";
import { useRouter } from "next/router";

const useDetails = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetailsHandler = async ({ path, _id, queryParams }) => {
    setLoading(true);
    try {
    //   if (path === "user-Details" || path === "order-Details" || path === "subscription-Details") {
    //     const res = await CustomerServices.getDetails({
    //       path,
    //       _id,
    //       queryParams,
    //     });
    //     console.log("Full response------>:", res);
    //     return res;
    //   } else 
      if (path === "calendar-Details") {
        console.log("id and path----->", _id, path);

        const res = await CustomerServices.getCalendarDetails({
          _id,
          path,
        });

        console.log("Full response------>:", res);
        return res;
      }
    } catch (error) {
      setError(error.message);
      console.error("Error during fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchDetailsHandler,
  };
};

export default useDetails;