#!/usr/bin/env node

const { ethers } = require('ethers');

async function testAPI() {
  console.log('🧪 Testing Web3 Message Verifier API\n');

  // Create test wallet and sign message
  const wallet = ethers.Wallet.createRandom();
  const message = 'Hello, Web3 World!';
  const signature = await wallet.signMessage(message);

  console.log('📝 Test data generated:');
  console.log(`Wallet address: ${wallet.address}`);
  console.log(`Message: "${message}"`);
  console.log(`Signature: ${signature}\n`);

  // Start server
  console.log('🚀 Starting server...');
  const app = require('./dist/server.js');
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test health endpoint
  console.log('🏥 Testing health endpoint...');
  try {
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData.status);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }

  // Test signature verification
  console.log('\n🔒 Testing signature verification...');
  try {
    const response = await fetch('http://localhost:3001/api/verify-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        signature,
      }),
    });

    const result = await response.json();
    
    if (result.isValid && result.signer.toLowerCase() === wallet.address.toLowerCase()) {
      console.log('✅ Signature verification passed!');
      console.log(`   Valid: ${result.isValid}`);
      console.log(`   Signer: ${result.signer}`);
      console.log(`   Original message: "${result.originalMessage}"`);
    } else {
      console.error('❌ Signature verification failed:', result);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Signature verification error:', error.message);
    process.exit(1);
  }

  // Test with invalid signature
  console.log('\n🚫 Testing invalid signature...');
  try {
    const response = await fetch('http://localhost:3001/api/verify-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Different message',
        signature,
      }),
    });

    const result = await response.json();
    
    if (!result.isValid || result.signer?.toLowerCase() !== wallet.address.toLowerCase()) {
      console.log('✅ Invalid signature properly rejected!');
      console.log(`   Valid: ${result.isValid}`);
      console.log(`   Signer: ${result.signer}`);
    } else {
      console.error('❌ Invalid signature was incorrectly accepted:', result);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Invalid signature test error:', error.message);
    process.exit(1);
  }

  console.log('\n🎉 All API tests passed successfully!');
  console.log('\n📚 API Documentation:');
  console.log('Health Check: GET http://localhost:3001/api/health');
  console.log('Verify Signature: POST http://localhost:3001/api/verify-signature');
  console.log('   Body: { "message": "string", "signature": "string" }');
  
  process.exit(0);
}

// Add fetch polyfill for older Node.js versions
if (!global.fetch) {
  const { default: fetch } = require('node-fetch');
  global.fetch = fetch;
}

testAPI().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});