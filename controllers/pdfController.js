const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
require('dotenv').config();
const pdf = require('pdf-parse');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).single('file');

exports.getPDFAdvice = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'File upload error', details: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Unknown error', details: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = await genAI.getGenerativeModel({ model: "gemini-pro" });

      // Parse PDF
      const pdfData = await pdf(req.file.buffer);
      const pdfText = pdfData.text;

      let prompt;
      if (req.body.message) {
        // Follow-up question
        prompt = `
        You are a financial advisor analyzing a financial document. Strictly answer only financial questions, don't  entertain any other query and ask the users to ask only finance realated question in that case. Here is the document content make sure to answer in consices and precise form:

        ${pdfText}

        User Question: ${req.body.message}

        Please provide a concise and short answer, to the point answer, professional response addressing the user's question based on the document content.
        Focus on specific information from the document while providing expert financial insights.

        Format your response in a clear, conversational way:
        1. Direct answer to the question
        2. Relevant information from the document
        3. Professional advice or recommendations if applicable
        4. Any important caveats or considerations

        Keep the tone professional but friendly, and make sure to reference specific details from the document when relevant. Just directly give the answer without any additional explanation or starting is required.
        `;
      } else {
        // Initial upload
        prompt = `
        You are a financial advisor who has just received a financial document. Here is the document content:

        ${pdfText}

        Please provide an initial analysis of this document:
        1. Identify the type of financial document
        2. List the key financial information present
        3. Note any important dates or deadlines
        4. Highlight any areas that might need attention

        Format your response in a clear, welcoming way that encourages further questions.
        Keep it concise but informative.
        `;
      }

      const result = await model.generateContent(prompt);
      res.json({ message: result.response.text() });

  } catch (error) {
    console.error('PDF Analysis Error:', error);
      res.status(500).json({ 
        error: 'Failed to analyze PDF',
        details: error.message 
      });
  }
});
};