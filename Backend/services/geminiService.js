const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  async generatePlanRecommendations(userProfile, usageData, availablePlans) {
    const prompt = `
    As a fiber internet service advisor, analyze the following user data and recommend the best plans:

    User Profile:
    - Name: ${userProfile.fullName}
    - Current Plan: ${userProfile.currentPlan || 'None'}
    - Preferences: ${userProfile.preferences?.join(', ') || 'None specified'}

    Usage Patterns (last 30 days):
    - Average daily usage: ${usageData.avgDailyUsage || 0} GB
    - Peak usage hours: ${usageData.peakHours?.join(', ') || 'Not available'}
    - Primary activities: ${Object.entries(usageData.activityBreakdown || {}).map(([k,v]) => `${k}: ${v}GB`).join(', ')}
    - Device count: ${usageData.deviceCount || 1}
    - Speed test results: ${usageData.avgSpeed || 'Not available'} Mbps
    - Satisfaction rating: ${usageData.satisfaction || 'Not provided'}/5

    Available Plans:
    ${availablePlans.map(plan => `
    - ${plan.name}: ${plan.speed} at ₹${plan.price}/${plan.duration}
      Features: ${plan.features?.join(', ')}
      Data Limit: ${plan.dataLimit}
      Target: ${plan.targetAudience?.join(', ')}
    `).join('')}

    Please provide:
    1. Top 3 recommended plans with detailed reasoning
    2. Cost-benefit analysis
    3. Upgrade/downgrade suggestions if applicable
    4. Usage optimization tips
    5. Potential cost savings opportunities

    Format the response as JSON with the following structure:
    {
      "recommendations": [
        {
          "planId": "plan_id",
          "planName": "plan_name",
          "reasoning": "detailed_explanation",
          "suitabilityScore": 85,
          "costBenefit": "analysis"
        }
      ],
      "usageInsights": "insights_about_current_usage",
      "optimizationTips": ["tip1", "tip2"],
      "costSavings": "potential_savings_explanation"
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON, fallback to structured text if parsing fails
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          recommendations: [],
          rawResponse: text,
          error: "Failed to parse structured response"
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  async generateAnalyticsInsights(historicalData, timeframe = '30d') {
    const prompt = `
    As a data analyst for a fiber internet service provider, analyze the following historical data and provide insights:

    Data Summary:
    - Time frame: ${timeframe}
    - Total customers: ${historicalData.totalCustomers || 0}
    - Total subscriptions: ${historicalData.totalSubscriptions || 0}
    - Revenue: ₹${historicalData.totalRevenue || 0}
    - Average usage per customer: ${historicalData.avgUsagePerCustomer || 0} GB
    - Customer satisfaction: ${historicalData.avgSatisfaction || 0}/5

    Plan Performance:
    ${historicalData.planPerformance?.map(plan => `
    - ${plan.name}: ${plan.subscribers} subscribers, ₹${plan.revenue} revenue, ${plan.avgUsage}GB avg usage
    `).join('') || 'No plan data available'}

    Customer Segments:
    ${historicalData.customerSegments?.map(segment => `
    - ${segment.type}: ${segment.count} customers, ₹${segment.avgRevenue} avg revenue
    `).join('') || 'No segment data available'}

    Issues & Complaints:
    ${historicalData.issues?.map(issue => `
    - ${issue.type}: ${issue.count} cases, ${issue.resolution}% resolved
    `).join('') || 'No issues data available'}

    Please provide comprehensive analytics including:
    1. Key performance indicators and trends
    2. Customer behavior patterns
    3. Revenue optimization opportunities
    4. Plan performance analysis
    5. Customer satisfaction insights
    6. Predictive recommendations for business growth
    7. Risk factors and mitigation strategies

    Format as JSON:
    {
      "kpis": {
        "customerGrowth": "percentage",
        "revenueGrowth": "percentage",
        "churnRate": "percentage",
        "avgRevenuePerUser": "amount"
      },
      "trends": ["trend1", "trend2"],
      "opportunities": ["opportunity1", "opportunity2"],
      "risks": ["risk1", "risk2"],
      "recommendations": ["rec1", "rec2"],
      "insights": "detailed_analysis"
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          insights: text,
          error: "Failed to parse structured response"
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate analytics insights');
    }
  }

  async analyzePlanOptimization(planData, marketData) {
    const prompt = `
    Analyze the current plan portfolio and suggest optimizations:

    Current Plans:
    ${planData.map(plan => `
    - ${plan.name}: ${plan.speed} at ₹${plan.price}/${plan.duration}
      Subscribers: ${plan.subscriberCount || 0}
      Revenue: ₹${plan.revenue || 0}
      Satisfaction: ${plan.avgSatisfaction || 0}/5
    `).join('')}

    Market Context:
    - Competitor pricing: ${marketData.competitorPricing || 'Not available'}
    - Market trends: ${marketData.trends?.join(', ') || 'Not available'}
    - Customer feedback themes: ${marketData.feedback?.join(', ') || 'Not available'}

    Provide optimization recommendations in JSON format:
    {
      "planOptimizations": [
        {
          "planId": "id",
          "currentPerformance": "analysis",
          "recommendations": ["rec1", "rec2"],
          "expectedImpact": "impact_description"
        }
      ],
      "newPlanSuggestions": [
        {
          "name": "suggested_plan_name",
          "targetSegment": "segment",
          "pricing": "suggested_price",
          "features": ["feature1", "feature2"],
          "marketGap": "gap_it_fills"
        }
      ],
      "pricingStrategy": "overall_pricing_recommendations"
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          optimization: text,
          error: "Failed to parse structured response"
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate plan optimization');
    }
  }
}

module.exports = new GeminiService();
