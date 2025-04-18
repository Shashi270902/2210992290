
 
const numbersService = require('../services/numbersService');


async function getNumbers(req, res) {
  try {
    const { type } = req.params;
    
    const validTypes = ['p', 'f', 'e', 'r'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid number type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    
    const result = await numbersService.processNumbers(type);
    
   
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error in getNumbers controller: ${error.message}`);
    
    
    if (error.message === 'Request timed out') {
      return res.status(504).json({ error: 'Gateway Timeout' });
    }
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getNumbers
};