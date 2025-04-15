
const httpClient = require('../utils/httpClient');
const config = require('../config');


let numberWindow = [];



 
async function processNumbers(type) {
  
  const typeEndpoints = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand'
  };
  
  const endpoint = typeEndpoints[type];
  
  const windowPrevState = [...numberWindow];
  
  try {
    const response = await httpClient.fetchNumbers(endpoint);
    const newNumbers = response.numbers || [];
    
    updateWindow(newNumbers);
    
    const avg = calculateAverage(numberWindow);
    
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