const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const resultsPath = path.join(__dirname, 'data', 'results.json');
    let results = [];
    if (fs.existsSync(resultsPath)) {
      const raw = fs.readFileSync(resultsPath, 'utf8');
      results = JSON.parse(raw);
    }
    results.push(data);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Result saved' })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
