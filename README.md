# English Learning MCP Server

A Model Context Protocol (MCP) server for English learning platform using Prisma, PostgreSQL and NestJS.

## Features

- **Vocabulary Management**: Search and manage English vocabulary with Vietnamese translations
- **Grammar Lessons**: Access structured grammar lessons with examples
- **Exam System**: TOEIC, IELTS and other English proficiency tests
- **Learning Paths**: Structured learning journeys for different skill levels
- **Progress Tracking**: Monitor user learning progress across different areas
- **Blog System**: Educational content and articles
- **MCP Integration**: AI assistant integration via Model Context Protocol

## Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Environment variables configured

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy from `env.example`):
```bash
cp env.example .env
# Edit .env with your database configuration
```

3. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database with sample data
npm run prisma:seed
```

### Development

- Start development server: `npm run dev`
- Build for production: `npm run build`
- Run tests: `npm test`
- Open Prisma Studio: `npm run prisma:studio`

## Database Schema

The application uses Prisma ORM with PostgreSQL and includes the following main entities:

- **Users & Roles**: User management and role-based access
- **Vocabulary**: English words with Vietnamese translations and examples
- **Grammar**: Grammar lessons with explanations and examples
- **Exams**: Test questions and answer options
- **Learning Paths**: Structured learning journeys
- **Blog**: Educational articles and content
- **Progress Tracking**: User learning progress and achievements

## MCP Tools

### Vocabulary Tools
- **get_vocabulary_by_topic**: Get vocabulary words by topic
- **get_vocabulary_topics**: List all vocabulary topics
- **search_vocabulary**: Search vocabulary by English or Vietnamese keywords

### Learning Content
- **get_grammar_lessons**: Access grammar lessons by difficulty level
- **get_exams**: Get exam questions and tests
- **get_learning_paths**: Retrieve structured learning paths

### Content Management
- **get_blog_posts**: Access educational blog posts
- **get_user_progress**: Track user learning progress

## Architecture

- **Prisma ORM**: Type-safe database access with auto-generated client
- **MCP Layer**: Tools exposed via Model Context Protocol
- **NestJS**: Dependency injection and modular architecture
- **PostgreSQL**: Relational database for structured data
- **Redis**: Caching layer for improved performance

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `REDIS_HOST`: Redis server host
- `REDIS_PORT`: Redis server port

## API Endpoints

- `GET /mcp/status`: Server status
- `GET /mcp/info`: Server information
- `GET /mcp/tools`: Available MCP tools
- `GET /mcp/resources`: Available resources
- `POST /mcp`: MCP protocol requests
- `GET /mcp/stream`: Server-sent events

## Usage Examples

### Get Vocabulary by Topic
```typescript
// Get vocabulary from "Daily Life" topic
const vocabulary = await mcpClient.callTool('get_vocabulary_by_topic', {
  topic_name: 'Daily Life',
  difficulty_level: 'Easy',
  limit: 10
});
```

### Search Vocabulary
```typescript
// Search for words containing "hello"
const results = await mcpClient.callTool('search_vocabulary', {
  keyword: 'hello',
  limit: 20
});
```

### Get Learning Paths
```typescript
// Get beginner learning paths
const paths = await mcpClient.callTool('get_learning_paths', {
  target_level: 'Beginner',
  limit: 5
});
```

## Contributing

1. Add new database models to `prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create migrations
3. Create new MCP tools in `src/mcp/`
4. Test your changes with `npm test`

## Testing

- Test MCP server: `npm run test:mcp`
- Demo MCP functionality: `npm run demo:mcp`
- Run unit tests: `npm test`
