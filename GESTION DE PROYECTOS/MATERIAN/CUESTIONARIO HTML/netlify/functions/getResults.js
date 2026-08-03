const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const resultsPath = path.join(__dirname, 'data', 'results.json');
    let results = [];
    if (fs.existsSync(resultsPath)) {
      const raw = fs.readFileSync(resultsPath, 'utf8');
      results = JSON.parse(raw);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(results),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
