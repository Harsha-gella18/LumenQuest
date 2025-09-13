export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date, format = 'short') => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: format,
  }).format(new Date(date));
};

export const calculateUsagePercentage = (used, total) => {
  if (!total || total === 0) return 0;
  return Math.min((used / total) * 100, 100);
};

export const getUsageStatus = (percentage) => {
  if (percentage >= 90) return { status: 'critical', color: 'error' };
  if (percentage >= 70) return { status: 'warning', color: 'warning' };
  return { status: 'normal', color: 'success' };
};
