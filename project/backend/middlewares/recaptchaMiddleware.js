import { verifyRecaptcha } from "../utils/verifyRecaptcha.js"; // Ajustez le chemin si nécessaire

const recaptchaMiddleware = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ error: "Token reCAPTCHA manquant" });
    }

    const isValid = await verifyRecaptcha(recaptchaToken);

    if (!isValid) {
      return res.status(401).json({ error: "Vérification reCAPTCHA échouée" });
    }

    next();
  } catch (error) {
    console.error("Erreur reCAPTCHA:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la vérification reCAPTCHA" });
  }
};

export default recaptchaMiddleware;
