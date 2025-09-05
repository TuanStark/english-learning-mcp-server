const { spawn } = require('child_process');
const axios = require('axios');

async function testMCP() {
  console.log('🚀 Testing MCP Server...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const response = await axios.get('http://localhost:3003');
    console.log('✅ Server is running on port 3003');
    console.log('Response:', response.status);
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }

  try {
    // Test 2: Test MCP tools endpoint
    console.log('\n2. Testing MCP tools...');
    const toolsResponse = await axios.get('http://localhost:3003/mcp/tools');
    console.log('✅ MCP tools endpoint accessible');
    console.log('Available tools:', toolsResponse.data);
  } catch (error) {
    console.log('❌ MCP tools test failed:', error.message);
  }

  try {
    // Test 3: Test database connection via MCP
    console.log('\n3. Testing database connection...');
    const dbTestResponse = await axios.post('http://localhost:3003/mcp/call', {
      tool: 'get_vocabulary_topics',
      parameters: {}
    });
    console.log('✅ Database connection successful');
    console.log('Response:', dbTestResponse.data);
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }

  console.log('\n🎉 MCP Server test completed!');
}

testMCP().catch(console.error);
