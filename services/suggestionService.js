const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class ProductAdvisorService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateProductAdvice(input) {
    try {
      const model = await this.genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
      AI PRODUCT ADVISOR WITH FINANCIAL INSIGHTS

      CONTEXT
      You are an AI financial advisor and product specialist. Analyze the user's financial situation and requirements to recommend suitable products while providing financial guidance, the user is from india, keep this in context.

      INPUT DETAILS
      ${JSON.stringify(input)}

      ANALYSIS REQUIREMENTS
      1. Consider user's budget constraints
      2. Factor in monthly income for affordability
      3. Analyze product category-specific requirements
      4. Provide financial planning advice
      5. Suggest alternatives if needed
      6. Consider long-term value and depreciation
      7. Factor in maintenance costs
      8. Consider user's location for availability

      OUTPUT FORMAT
      Generate a JSON response with the following structure:
      {
        "productRecommendations": {
          "primaryChoice": {
            "name": "String",
            "price": "Number",
            "specifications": ["Spec 1", "Spec 2"],
            "keyFeatures": ["Feature 1", "Feature 2"],
            "reasonsToBuy": ["Reason 1", "Reason 2"]
          },
          "alternatives": [{
            "name": "String",
            "price": "Number",
            "keyDifferences": ["Difference 1", "Difference 2"]
          }]
        },
        "financialAnalysis": {
          "affordabilityScore": "Number (1-10)",
          "monthlyImpact": {
            "percentage": "Number",
            "sustainabilityPeriod": "String"
          },
          "savingsSuggestions": ["Suggestion 1", "Suggestion 2"],
          "budgetingTips": ["Tip 1", "Tip 2"]
        },
        "marketInsights": {
          "priceHistory": {
            "trend": "String",
            "bestTimeToBuy": "String"
          },
          "futureConsiderations": ["Consideration 1", "Consideration 2"]
        },
        "financialAdvice": {
          "immediateSteps": ["Step 1", "Step 2"],
          "longTermConsiderations": ["Consideration 1", "Consideration 2"],
          "risksToConsider": ["Risk 1", "Risk 2"],
          "investmentPerspective": "String"
        }
      }

      IMPORTANT: Respond ONLY with a valid, parseable JSON. No additional text.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      try {
        const cleanedResponse = responseText
          .replace(/^```json\n|```$/g, '')
          .replace(/^```\n|```$/g, '');
        
        console.log('Parsed JSON response:', cleanedResponse);
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        throw new Error('Failed to parse product advice response');
      }
    } catch (error) {
      console.error('Product Advisory Generation Error:', error);
      throw new Error('Product recommendation generation failed');
    }
  }

  categorizeProduct(productType) {
    const categories = {
      electronics: ['smartphone', 'laptop', 'tv', 'camera', 'tablet'],
      vehicles: ['car', 'motorcycle', 'bicycle', 'scooter'],
      appliances: ['refrigerator', 'washer', 'ac', 'microwave'],
      furniture: ['sofa', 'bed', 'table', 'chair', 'wardrobe']
    };

    for (const [category, items] of Object.entries(categories)) {
      if (items.includes(productType.toLowerCase())) {
        return category;
      }
    }
    return 'other';
  }

  validateInput(input) {
    const requiredFields = ['budget', 'monthlyIncome', 'productType', 'location'];
    const missingFields = requiredFields.filter(field => !input[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (input.budget <= 0 || input.monthlyIncome <= 0) {
      throw new Error('Budget and monthly income must be positive numbers');
    }

    return true;
  }
}

module.exports = new ProductAdvisorService();