# CLAUDE.md - Debate Arena Project Guide

## Project Overview

**Debate Arena** is a platform for hosting, managing, and participating in structured debates. This document serves as a comprehensive guide for AI assistants working on this codebase.

### Project Goals
- Provide a robust platform for online debates
- Support multiple debate formats (formal, informal, structured, etc.)
- Enable real-time or asynchronous debate participation
- Facilitate audience engagement and voting
- Maintain debate history and analytics

---

## Repository Information

- **Repository**: Nathen72/debate_arena
- **Development Branch Pattern**: `claude/claude-md-*` (for AI-assisted development)
- **Status**: Active Development

---

## Codebase Structure

The expected structure for this project follows modern web application best practices:

### Anticipated Directory Structure

```
debate_arena/
├── src/                      # Source code
│   ├── api/                  # API routes and controllers
│   ├── components/           # Reusable UI components
│   ├── models/              # Data models and schemas
│   ├── services/            # Business logic services
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   └── config/              # Configuration files
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── docs/                    # Documentation
├── scripts/                 # Build and deployment scripts
├── public/                  # Static assets
└── .github/                 # GitHub workflows and templates
```

### Key Modules (To Be Implemented)

#### Debates Module
- Debate creation and management
- Debate format definitions
- Participant management
- Time management for timed debates

#### Users Module
- User authentication and authorization
- User profiles and reputation
- Role management (debater, moderator, judge, audience)

#### Voting Module
- Voting mechanisms
- Vote tallying and results
- Audience engagement features

#### Analytics Module
- Debate statistics
- User analytics
- Performance metrics

---

## Development Workflows

### Branch Strategy

1. **Main Branch**: Production-ready code
2. **Development Branch**: Integration branch for features
3. **Feature Branches**: `feature/feature-name`
4. **Claude Branches**: `claude/claude-md-*` (AI-assisted development)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: descriptive commit message"

# Push changes
git push -u origin feature/your-feature-name
```

### Commit Message Convention

Follow the Conventional Commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples**:
```
feat: add debate creation endpoint
fix: resolve vote counting bug in multi-option polls
docs: update API documentation for debate endpoints
refactor: optimize debate query performance
test: add unit tests for voting service
```

---

## Technology Stack

### Expected Technologies (To Be Confirmed)

#### Backend
- **Runtime**: Node.js or Python
- **Framework**: Express.js, FastAPI, or similar
- **Database**: PostgreSQL, MongoDB, or similar
- **Authentication**: JWT, OAuth2
- **Real-time**: WebSockets (Socket.io) or Server-Sent Events

#### Frontend
- **Framework**: React, Vue.js, or similar
- **State Management**: Redux, Zustand, or Context API
- **Styling**: Tailwind CSS, styled-components, or CSS modules
- **Build Tool**: Vite, Webpack, or similar

#### Testing
- **Unit Tests**: Jest, Vitest, or pytest
- **E2E Tests**: Playwright, Cypress
- **API Tests**: Supertest or similar

---

## Key Conventions for AI Assistants

### Code Quality Standards

1. **Type Safety**: Use TypeScript or type hints (Python) for all code
2. **Linting**: Follow ESLint/Prettier (JS/TS) or Black/Flake8 (Python) rules
3. **Documentation**: Add JSDoc/TSDoc comments for public APIs
4. **Error Handling**: Always handle errors gracefully with appropriate messages
5. **Security**: Validate inputs, sanitize outputs, prevent injection attacks

### Security Considerations

- **Input Validation**: Validate all user inputs on both client and server
- **Authentication**: Implement proper authentication for all protected routes
- **Authorization**: Check permissions before allowing actions
- **SQL Injection**: Use parameterized queries or ORMs
- **XSS Prevention**: Sanitize user-generated content
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Rate Limiting**: Implement rate limiting on API endpoints

### Testing Requirements

- **Coverage**: Aim for 80%+ code coverage
- **Test Types**: Write unit, integration, and E2E tests
- **Test Before Fix**: Write failing tests before fixing bugs
- **Mock External Services**: Mock external APIs and services in tests

### Performance Guidelines

- **Database Queries**: Optimize queries, use indexes
- **Caching**: Implement caching for frequently accessed data
- **Pagination**: Paginate large data sets
- **Lazy Loading**: Load resources only when needed
- **Bundle Size**: Keep frontend bundle sizes minimal

---

## Common Development Tasks

### Adding a New Feature

1. **Plan**: Create a todo list using TodoWrite
2. **Research**: Understand existing patterns in the codebase
3. **Implement**: Write code following conventions
4. **Test**: Add comprehensive tests
5. **Document**: Update relevant documentation
6. **Review**: Self-review changes before committing
7. **Commit**: Use conventional commit messages
8. **Push**: Push to the appropriate branch

### Fixing a Bug

1. **Reproduce**: Verify the bug exists
2. **Test**: Write a failing test that reproduces the bug
3. **Fix**: Implement the fix
4. **Verify**: Ensure the test passes
5. **Check**: Look for similar bugs elsewhere
6. **Commit**: Use `fix:` prefix in commit message

### Refactoring Code

1. **Tests First**: Ensure existing tests pass
2. **Small Steps**: Make incremental changes
3. **Test Continuously**: Run tests after each change
4. **Preserve Behavior**: Don't change functionality
5. **Document**: Update comments and documentation
6. **Commit**: Use `refactor:` prefix

---

## API Design Principles

### RESTful Conventions

```
GET    /api/debates          - List debates
GET    /api/debates/:id      - Get specific debate
POST   /api/debates          - Create debate
PUT    /api/debates/:id      - Update debate
DELETE /api/debates/:id      - Delete debate
POST   /api/debates/:id/vote - Vote on debate
```

### Response Format

```json
{
  "success": true,
  "data": { },
  "message": "Operation successful",
  "timestamp": "2025-11-17T15:30:00Z"
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { }
  },
  "timestamp": "2025-11-17T15:30:00Z"
}
```

---

## Database Schema Guidelines

### Naming Conventions

- **Tables**: Plural, snake_case (e.g., `debates`, `user_votes`)
- **Columns**: snake_case (e.g., `created_at`, `user_id`)
- **Primary Keys**: `id` (UUID or auto-increment)
- **Foreign Keys**: `{table}_id` (e.g., `debate_id`, `user_id`)
- **Timestamps**: `created_at`, `updated_at`, `deleted_at`

### Core Entities

#### Debates
- id, title, description, format, status
- creator_id, start_time, end_time
- created_at, updated_at

#### Users
- id, username, email, password_hash
- role, reputation, avatar_url
- created_at, updated_at

#### Debate Participants
- id, debate_id, user_id, position
- joined_at, active_status

#### Votes
- id, debate_id, user_id, vote_value
- created_at, updated_at

---

## Frontend Component Patterns

### Component Structure

```typescript
// src/components/DebateCard/DebateCard.tsx
import React from 'react';
import styles from './DebateCard.module.css';

interface DebateCardProps {
  debate: Debate;
  onVote?: (debateId: string, vote: number) => void;
}

export const DebateCard: React.FC<DebateCardProps> = ({ debate, onVote }) => {
  // Component logic
  return (
    <div className={styles.card}>
      {/* Component JSX */}
    </div>
  );
};
```

### State Management

- **Local State**: Use `useState` for component-specific state
- **Global State**: Use context or state management library
- **Server State**: Use React Query or SWR for API data

---

## Testing Patterns

### Unit Test Example

```typescript
describe('DebateService', () => {
  describe('createDebate', () => {
    it('should create a debate with valid data', async () => {
      const debateData = {
        title: 'Test Debate',
        description: 'Test Description',
        format: 'formal'
      };

      const result = await debateService.createDebate(debateData);

      expect(result).toBeDefined();
      expect(result.title).toBe(debateData.title);
    });

    it('should throw error with invalid data', async () => {
      await expect(debateService.createDebate({}))
        .rejects.toThrow('Invalid debate data');
    });
  });
});
```

---

## Deployment

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.example
DATABASE_URL=postgresql://user:password@localhost:5432/debate_arena
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000
```

### Pre-deployment Checklist

- [ ] All tests pass
- [ ] Code is linted and formatted
- [ ] Environment variables are configured
- [ ] Database migrations are ready
- [ ] Documentation is updated
- [ ] Security review completed
- [ ] Performance tested

---

## Common Patterns and Utilities

### Error Handling

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

// Usage
throw new AppError(404, 'Debate not found', 'DEBATE_NOT_FOUND');
```

### Async Handler Wrapper

```typescript
const asyncHandler = (fn: Function) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.get('/debates/:id', asyncHandler(async (req, res) => {
  const debate = await debateService.getById(req.params.id);
  res.json({ success: true, data: debate });
}));
```

---

## AI Assistant Guidelines

### When Adding Features

1. **Understand Context**: Read related code before implementing
2. **Follow Patterns**: Match existing code style and patterns
3. **Use TodoWrite**: Track multi-step tasks
4. **Test Thoroughly**: Write tests for new features
5. **Document Changes**: Update relevant documentation
6. **Security First**: Consider security implications
7. **Performance**: Consider performance impact

### When Fixing Bugs

1. **Reproduce First**: Verify the bug exists
2. **Write Test**: Create a failing test
3. **Minimal Fix**: Make the smallest change that fixes the issue
4. **Regression Check**: Ensure no new bugs are introduced
5. **Document**: Add comments explaining the fix if non-obvious

### Code Review Checklist

Before committing, verify:
- [ ] Code follows project conventions
- [ ] Tests are added and passing
- [ ] No console.log or debug code left
- [ ] Error handling is proper
- [ ] Security best practices followed
- [ ] Performance is acceptable
- [ ] Documentation is updated
- [ ] Commit message is descriptive

---

## Resources and References

### Documentation Locations

- API Documentation: `/docs/api.md`
- Database Schema: `/docs/database.md`
- Deployment Guide: `/docs/deployment.md`
- Contributing Guide: `/docs/CONTRIBUTING.md`

### Useful Commands

```bash
# Install dependencies
npm install  # or: pip install -r requirements.txt

# Run development server
npm run dev  # or: python manage.py runserver

# Run tests
npm test     # or: pytest

# Run linter
npm run lint # or: flake8 .

# Format code
npm run format # or: black .

# Build for production
npm run build

# Database migrations
npm run migrate # or: alembic upgrade head
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL in .env
   - Verify database server is running
   - Check firewall/network settings

2. **Test Failures**
   - Clear test database
   - Check for test isolation issues
   - Verify mock data is correct

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all dependencies are installed

4. **Authentication Issues**
   - Check JWT_SECRET configuration
   - Verify token expiration settings
   - Check CORS configuration

---

## Version History

- **v1.0** (2025-11-17): Initial CLAUDE.md created for debate_arena project

---

## Contact and Support

For questions or issues:
- Repository: Nathen72/debate_arena
- Create an issue on GitHub for bugs or feature requests
- Check existing documentation in `/docs` folder

---

**Last Updated**: 2025-11-17
**Maintained By**: AI Assistants working on debate_arena
