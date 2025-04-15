/**
 * Controller for handling number-related requests
 */
const numbersService = require('../services/numbersService');

/**
 * Handles requests to retrieve numbers of a specified type
 * and calculates their average
 */
async function getNumbers(req, res) {
  try {
    const { type } = req.params;
    
    // Validate number type parameter
    const validTypes = ['p', 'f', 'e', 'r'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid number type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    // Get numbers and statistics from the service
    const result = await numbersService.processNumbers(type);
    
    // Return the result
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error in getNumbers controller: ${error.message}`);
    
    // Return appropriate error response
    if (error.message === 'Request timed out') {
      return res.status(504).json({ error: 'Gateway Timeout' });
    }
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getNumbers
};