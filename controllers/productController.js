const GeminiService = require('../services/suggestionService');

exports.getProductAdvice = async (req, res) => {
  try {
    const inputData = req.body;
    const advice = await GeminiService.generateProductAdvice(inputData);
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};