const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  console.log('🔍 Testing database connection...\n');
  
  const prisma = new PrismaClient();
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test 2: Query vocabulary topics
    console.log('\n2. Testing vocabulary topics query...');
    const topics = await prisma.vocabularyTopic.findMany({
      take: 5
    });
    console.log('✅ Vocabulary topics query successful');
    console.log('Found topics:', topics.length);
    if (topics.length > 0) {
      console.log('Sample topic:', topics[0]);
    }
    
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
  
  console.log('\n🎉 Database test completed!');
}

testDatabase().catch(console.error);
