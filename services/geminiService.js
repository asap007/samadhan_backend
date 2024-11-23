const { GoogleGenerativeAI } = require('@google/generative-ai');

class ComprehensiveFinancialAdvisor {
  constructor() {
    this.genAI = new GoogleGenerativeAI('');
  }

  async generateFinancialAdvice(input) {
    try {
      console.log('Initializing generative model...');
      const model = await this.genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
      COMPREHENSIVE FINANCIAL ADVISORY FOR INDIAN CONSUMERS

      CONTEXT
      You are an advanced financial optimization assistant specializing in providing strategic financial advice for various purchase scenarios in the Indian market. Your goal is to deliver comprehensive, actionable, and personalized financial recommendations.

      INPUT DETAILS
      ${JSON.stringify(input)}

      ANALYSIS FRAMEWORK

      I. OPTIMAL PAYMENT STRATEGY
        A. PRIMARY PAYMENT METHOD
          - Recommended Payment Platform
          - Percentage of Total Amount
          - Specific Bank/Card Details

        B. SECONDARY PAYMENT METHOD
          - Alternative Payment Approach
          - Complementary Percentage
          - Unique Advantages

        C. SAVINGS OPTIMIZATION
          - Total Potential Savings
          - Breakdown of Financial Benefits
          - Comparative Payment Analysis

      II. DETAILED FINANCIAL BREAKDOWN
        A. PAYMENT METHOD ANALYSIS
          - Pros and Cons of Each Approach
          - Bank-Specific Offers
          - Credit Instrument Performance

        B. MARKET-SPECIFIC INSIGHTS
          - Current Financial Trends
          - Regional Payment Advantages
          - Technology-Enabled Payment Solutions

      III. STRATEGIC RECOMMENDATIONS
        A. IMMEDIATE ACTION STEPS
          - Specific Implementation Guidelines
          - Step-by-Step Financial Optimization
          - Cost Reduction Techniques

        B. RISK MITIGATION
          - Potential Financial Risks
          - Credit Score Implications
          - Long-Term Financial Health

      IV. CONTEXTUAL ENHANCEMENTS
        - Special Handling for:
          > Vehicle Purchases
          > Real Estate Investments
          > High-Value Transactions
          > Consumer Durables

      V. SUGGESTIONS
        -specific suggestion about what the user should do as you know about my credit score, my income, so give some good financial advice,
        but give information about only the type of purchase type and the amount of money that the user is going to spend.

      OUTPUT FORMAT
      Generate a comprehensive JSON response:
      {
        "optimizationStrategy": {
          "primaryMethod": {
            "platform": "String",
            "percentage": "Number",
            "bankDetails": "String"
          },
          "secondaryMethod": {
            "platform": "String", 
            "percentage": "Number",
            "advantages": ["Array of advantages"]
          }
        },
        "potentialSavings": {
          "total": "₹Amount",
          "breakdown": ["Saving source 1", "Saving source 2"]
        },
        "actionSteps": ["Step 1", "Step 2", "Step 3"],
        "riskAssessment": {
          "financialRisks": ["Risk 1", "Risk 2"],
          "creditScoreImpact": "Minimal/Moderate/Significant"
        },
        "contextualRecommendations": {
          "specificScenario": ["Recommendation 1", "Recommendation 2"]
        },
        "suggestions": {
          "specificScenario": ["Suggestion 1", "Suggestion 2"]
          }
      }

      IMPORTANT: Respond ONLY with a valid, parseable JSON string. No additional text.
      `;

      console.log('Sending prompt to model...');
      const result = await model.generateContent(prompt);

      console.log('Model response received:', result);
      if (!result || !result.response) {
        throw new Error('Invalid response from Generative AI model.');
      }

      const responseText = result.response.text().trim();
      console.log('Raw response text:', responseText);

      try {
        // Remove JSON code block markers if present
        const cleanedResponse = responseText
          .replace(/^```json\n|```$/g, '')
          .replace(/^```\n|```$/g, '');
        
        const parsedResponse = JSON.parse(cleanedResponse);
        console.log('Parsed JSON response:', parsedResponse);
        return parsedResponse;
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError.message);
        console.error('Raw Response:', responseText);
        throw new Error('Failed to parse financial advice response');
      }
    } catch (error) {
      console.error('Financial Advisory Generation Error:', error.message);
      throw new Error('Comprehensive financial advice generation failed');
    }
  }

  // Optional: Add method for scenario-specific analysis
  async analyzeSpecificScenario(scenarioType, input) {
    try {
      const model = await this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const scenarioPrompt = `
      Specialized Financial Analysis for ${scenarioType}
      Input Details: ${JSON.stringify(input)}
      
      Provide a targeted financial strategy focusing on unique considerations for this scenario.
      `;

      const result = await model.generateContent(scenarioPrompt);
      return result.response.text();
    } catch (error) {
      console.error(`${scenarioType} Analysis Error:`, error);
      throw new Error(`Failed to analyze ${scenarioType} scenario`);
    }
  }
}

module.exports = new ComprehensiveFinancialAdvisor();