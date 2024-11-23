const GeminiService = require('../services/geminiService');

exports.getFinancialAdvice = async (req, res) => {
  try {
    const inputData = req.body;
    const advice = await GeminiService.generateFinancialAdvice(inputData);
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};