const IS_PROD = process.env.NODE_ENV === "production";

const config = {
  BASE_URL: IS_PROD
    ? "https://api.lunchbowl.co.in"
    : "http://localhost:5055",
  SOCKET_URL: IS_PROD
    ? "https://api.lunchbowl.co.in"
    : "http://localhost:5055",
  // add other keys here as required
};

export default config;
