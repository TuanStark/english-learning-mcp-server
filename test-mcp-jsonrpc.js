const axios = require('axios');

async function testMCP() {
  console.log('🚀 Testing MCP Server with JSON-RPC...\n');
  
  const mcpUrl = 'http://localhost:3003/mcp';
  
  try {
    // Test 1: List tools
    console.log('1. Testing list tools...');
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    };
    
    const toolsResponse = await axios.post(mcpUrl, listToolsRequest, {
      headers: {
        'Accept': 'application/json, text/event-stream',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ List tools successful');
    console.log('Available tools:', JSON.stringify(toolsResponse.data, null, 2));
    
    // Test 2: Call a tool
    console.log('\n2. Testing call tool...');
    const callToolRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_vocabulary_topics',
        arguments: {}
      }
    };
    
    const callResponse = await axios.post(mcpUrl, callToolRequest, {
      headers: {
        'Accept': 'application/json, text/event-stream',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Call tool successful');
    console.log('Tool result:', JSON.stringify(callResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ MCP test failed:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
    }
  }
  
  console.log('\n🎉 MCP Server test completed!');
}

testMCP().catch(console.error);
