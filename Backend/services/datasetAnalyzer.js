const XLSX = require('xlsx');
const path = require('path');

class DatasetAnalyzer {
  constructor() {
    this.datasetPath = path.join(__dirname, '..', 'SubscriptionUseCase_Dataset.xlsx');
    this.data = null;
  }

  loadDataset() {
    try {
      const workbook = XLSX.readFile(this.datasetPath);
      const sheetNames = workbook.SheetNames;
      this.data = {};
      
      sheetNames.forEach(sheetName => {
        this.data[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      });
      
      return this.data;
    } catch (error) {
      console.error('Error loading dataset:', error);
      throw new Error('Failed to load dataset');
    }
  }

  getDatasetSummary() {
    if (!this.data) {
      this.loadDataset();
    }

    const summary = {};
    Object.keys(this.data).forEach(sheetName => {
      const sheet = this.data[sheetName];
      summary[sheetName] = {
        rowCount: sheet.length,
        columns: sheet.length > 0 ? Object.keys(sheet[0]) : [],
        sampleData: sheet.slice(0, 3) // First 3 rows as sample
      };
    });

    return summary;
  }

  getHistoricalAnalytics(timeframe = 'all') {
    if (!this.data) {
      this.loadDataset();
    }

    // Analyze the dataset for admin analytics
    const analytics = {
      totalRecords: 0,
      sheets: {},
      insights: {}
    };

    Object.keys(this.data).forEach(sheetName => {
      const sheet = this.data[sheetName];
      analytics.totalRecords += sheet.length;
      analytics.sheets[sheetName] = {
        count: sheet.length,
        columns: sheet.length > 0 ? Object.keys(sheet[0]) : []
      };
    });

    return analytics;
  }

  getUserUsagePatterns(userId = null) {
    if (!this.data) {
      this.loadDataset();
    }

    // Extract usage patterns from the dataset
    const patterns = {
      avgUsage: 0,
      peakHours: [],
      activityBreakdown: {},
      deviceCount: 1,
      satisfaction: 4
    };

    // Process the dataset to extract meaningful patterns
    // This will be customized based on the actual dataset structure
    return patterns;
  }

  getRecommendationData() {
    if (!this.data) {
      this.loadDataset();
    }

    // Extract data relevant for plan recommendations
    return {
      userProfiles: [],
      usagePatterns: [],
      planPerformance: []
    };
  }
}

module.exports = new DatasetAnalyzer();
