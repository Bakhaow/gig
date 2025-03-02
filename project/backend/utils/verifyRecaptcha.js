import dotenv from "dotenv";
dotenv.config();

export const verifyRecaptcha = async (token) => {
  try {
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error("RECAPTCHA_SECRET_KEY is missing!");
      return false;
    }

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      }
    );

    if (!response.ok) {
      console.error("Error from Google API:", response.statusText);
      return false;
    }

    const data = await response.json();

    return data.success;
  } catch (error) {
    console.error("reCAPTCHA error:", error);
    return false;
  }
};
