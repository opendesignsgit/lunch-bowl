import { useEffect, useState } from "react";

export default function PaymentCallback() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // POST encResp from query to /api/ccavenue/callback
    const urlParams = new URLSearchParams(window.location.search);
    const encResp = urlParams.get("encResp");

    if (encResp) {
      fetch("/api/ccavenue/callback", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `encResp=${encodeURIComponent(encResp)}`,
      })
        .then((res) => res.json())
        .then(setResult);
    }
  }, []);

  if (!result) return <div>Processing payment, please wait...</div>;
  if (result.success)
    return (
      <div>
        <h2>Payment Successful!</h2>
        <pre>{JSON.stringify(result.payment_data, null, 2)}</pre>
      </div>
    );
  return (
    <div>
      <h2>Payment Failed or Cancelled!</h2>
      <pre>{JSON.stringify(result.payment_data, null, 2)}</pre>
    </div>
  );
}