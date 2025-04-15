/**
 * Service for processing number requests and maintaining the sliding window
 */
const httpClient = require('../utils/httpClient');
const config = require('../config');

// Store for the sliding window of numbers
let numberWindow = [];

/**
 * Process number requests based on type and update sliding window
 * @param {string} type - The type of numbers to retrieve (p, f, e, r)
 * @returns {Object} The window states and average
 */
async function processNumbers(type) {
  // Map type to corresponding endpoint
  const typeEndpoints = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand'
  };
  
  const endpoint = typeEndpoints[type];
  
  // Save current window state before making the request
  const windowPrevState = [...numberWindow];
  
  try {
    // Fetch numbers from the evaluation service
    const response = await httpClient.fetchNumbers(endpoint);
    const newNumbers = response.numbers || [];
    
    // Process the new numbers
    updateWindow(newNumbers);
    
    // Calculate the average of the current window
    const avg = calculateAverage(numberWindow);
    
    // Return the result with proper formatting
    return {
      windowPrevState,
      windowCurrState: [...numberWindow],
      numbers: newNumbers,
      avg: parseFloat(avg.toFixed(2))
    };
  } catch (error) {
    console.error(`Error fetching ${endpoint} numbers:`, error.message);
    throw error;
  }
}


function updateWindow(newNumbers) {
  for (const num of newNumbers) {
    // Skip if number already exists in the window
    if (numberWindow.includes(num)) {
      continue;
    }
    if (numberWindow.length >= config.windowSize) {
      numberWindow.shift();
    }
    
    numberWindow.push(num);
  }
}


function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
}

module.exports = {
  processNumbers
};