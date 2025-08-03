export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const formatPercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}