import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SprintSync API',
      version: '1.0.0',
      description: `
# SprintSync API Documentation

RESTful API for the SprintSync task management application. 
All endpoints require JWT authentication unless otherwise specified.

## Authentication
- Register a new user account at \`POST /api/auth/register\`
- Login to get JWT token at \`POST /api/auth/login\`
- Include token in headers: \`Authorization: Bearer <your_token>\`

## Rate Limiting
- API is rate limited to 100 requests per 15 minutes per IP address

## Error Responses
All errors follow the same format:
\`\`\`json
{
  "error": "Error message description"
}
\`\`\`
      `,
      contact: {
        name: 'API Support',
        email: 'etikos@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Development server',
      },
      
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint'
        }
      },
      schemas: {
        // User Schemas
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated user ID',
              example: 1
            },
            email: {
              type: 'string',
                  format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
                  format: 'password',
              description: 'User password (min 6 characters)',
              example: 'securepassword123'
            },
            isAdmin: {
              type: 'boolean',
              description: 'Admin privileges flag',
              example: false
            },
            createdAt: {
              type: 'string',
                  format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
                  format: 'date-time',
              description: 'User update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            isAdmin: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        
        // Task Schemas
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated task ID',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Complete project documentation'
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Write comprehensive documentation for the SprintSync API'
            },
            status: {
              type: 'string',
              enum: ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'],
              description: 'Task status',
              example: 'IN_PROGRESS'
            },
            totalMinutes: {
              type: 'integer',
              description: 'Total time spent on task in minutes',
              example: 120
            },
            authorId: {
              type: 'integer',
              description: 'ID of the user who created the task',
              example: 1
            },
            createdAt: {
              type: 'string',
                  format: 'date-time',
              description: 'Task creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
                  format: 'date-time',
              description: 'Task update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        
        // Auth Schemas
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful' },
            data: { 
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'user@example.com' },
                isAdmin: { type: 'boolean', example: false }
              }
            },
            token: { 
              type: 'string', 
              description: 'JWT token for authentication',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        
        // AI Suggestion Schema
        AISuggestion: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title for AI suggestion',
              example: 'Create user authentication'
            }
          }
        },
        AISuggestionResponse: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'AI-generated task description',
              example: 'Implement JWT-based user authentication with secure password hashing and token refresh functionality.'
            }
          }
        },
        
        // Error Schema
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'User not found'
            }
          }
        }
      },
      parameters: {
        taskId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'ID of the task to operate on'
        },
        statusParam: {
          in: 'query',
          name: 'status',
          required: false,
          schema: { 
            type: 'string',
            enum: ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']
          },
          description: 'Filter tasks by status'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Not authorized, no token provided'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Task not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Validation failed: email must be a valid email address'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User registration and login endpoints'
      },
      {
        name: 'Tasks',
        description: 'Task management operations'
      },
      {
        name: 'AI',
        description: 'AI-powered task suggestions'
      },
      {
        name: 'Users',
        description: 'User management (admin only)'
      }
    ],
    externalDocs: {
      description: 'SprintSync GitHub Repository',
      url: 'https://github.com/etikos1/sprint-sync'
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js',
    './src/middleware/*.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Custom Swagger UI options
  const swaggerUiOptions = {
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info h2 { display: none; }
      .swagger-ui .info .title { font-size: 24px; font-weight: bold; }
      .swagger-ui .btn.authorize { background-color: #1890ff; }
    `,
    customSiteTitle: 'SprintSync API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true
    }
  };

  // Swagger Page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
  
  // Documentation in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Documentation in YAML format
  app.get('/api-docs.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/yaml');
    // You might want to use a YAML stringifier here
    res.send(swaggerSpec);
  });

  console.log(`📚 API Docs available at http://localhost:${process.env.PORT || 5000}/api-docs`);
  console.log(`📝 API JSON spec available at http://localhost:${process.env.PORT || 5000}/api-docs.json`);
};

export default swaggerDocs;