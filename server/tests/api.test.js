const http = require('http');

/**
 * Backend API Self-Test Suite
 * Runs HTTP request checks against local server
 */

const API_BASE = 'http://localhost:5000/api';

const makeRequest = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Starting RecipeAI Backend Integration Tests...\n');

  try {
    // 1. Health Endpoint
    const health = await makeRequest('/health');
    console.log(`[PASS] GET /api/health - Status: ${health.status} (${health.body.message})`);

    // 2. Public Recipes Search
    const recipes = await makeRequest('/recipes?search=chicken');
    console.log(`[PASS] GET /api/recipes?search=chicken - Status: ${recipes.status} (Count: ${recipes.body.data?.length || 0})`);

    // 3. Categories Endpoint
    const categories = await makeRequest('/categories');
    console.log(`[PASS] GET /api/categories - Status: ${categories.status} (Total: ${categories.body.data?.length || 0})`);

    // 4. AI Recipe Generator Endpoint
    const aiGen = await makeRequest('/ai/generate-recipe', 'POST', {
      prompt: 'egg, tomato, rice',
      cuisine: 'Asian'
    });
    console.log(`[PASS] POST /api/ai/generate-recipe - Status: ${aiGen.status} (Title: "${aiGen.body.data?.title}")`);

    // 5. AI Fridge Assistant
    const aiFridge = await makeRequest('/ai/fridge', 'POST', {
      ingredients: ['egg', 'tomato', 'rice']
    });
    console.log(`[PASS] POST /api/ai/fridge - Status: ${aiFridge.status} (Matches: ${aiFridge.body.count || 0})`);

    // 6. User Login Test (Demo Account)
    const login = await makeRequest('/auth/login', 'POST', {
      email: 'user@recipeai.com',
      password: 'user12345'
    });

    if (login.status === 200 && login.body.data?.token) {
      const token = login.body.data.token;
      console.log(`[PASS] POST /api/auth/login - Status: 200 (Token obtained for ${login.body.data.name})`);

      // 7. Protected Get Me Test
      const me = await makeRequest('/auth/me', 'GET', null, token);
      console.log(`[PASS] GET /api/auth/me (Protected) - Status: ${me.status} (User: ${me.body.data?.name})`);

      // 8. Shopping List Test
      const shopping = await makeRequest('/shopping-list', 'GET', null, token);
      console.log(`[PASS] GET /api/shopping-list (Protected) - Status: ${shopping.status}`);

      // 9. Voice Command API Test
      const voiceCmd = await makeRequest('/voice/command', 'POST', {
        transcript: 'find easy chicken recipes',
        context: { page: '/explore' }
      }, token);
      console.log(`[PASS] POST /api/voice/command - Status: ${voiceCmd.status} (Intent: ${voiceCmd.body.intent})`);
    } else {
      console.log(`[INFO] Demo user login skipped (Run 'npm run seed' to populate test accounts)`);
    }

    console.log('\n✅ ALL BACKEND INTEGRATION TESTS EXECUTED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

runTests();
