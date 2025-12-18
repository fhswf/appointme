import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Appoint Me API',
            version: '1.24.0',
            description: 'API documentation for Appoint Me - A flexible appointment booking system',
            contact: {
                name: 'Christian Gawron',
                email: 'gawron.christian@fh-swf.de'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: process.env.CLIENT_URL,
                description: 'This server'
            },
            {
                url: 'http://localhost:5000',
                description: 'Development server (local)'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token obtained from login'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'access_token',
                    description: 'JWT token stored in cookie'
                },
                csrfToken: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-csrf-token',
                    description: 'CSRF token for state-changing operations'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        error: {
                            type: 'string',
                            description: 'Error details'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        name: {
                            type: 'string',
                            description: 'User full name'
                        },
                        url: {
                            type: 'string',
                            description: 'User URL slug'
                        },
                        locale: {
                            type: 'string',
                            description: 'User preferred locale'
                        }
                    }
                },
                Event: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Event ID'
                        },
                        title: {
                            type: 'string',
                            description: 'Event title'
                        },
                        description: {
                            type: 'string',
                            description: 'Event description'
                        },
                        duration: {
                            type: 'number',
                            description: 'Event duration in minutes'
                        },
                        url: {
                            type: 'string',
                            description: 'Event URL slug'
                        },
                        active: {
                            type: 'boolean',
                            description: 'Whether the event is active'
                        },
                        userId: {
                            type: 'string',
                            description: 'Owner user ID'
                        }
                    }
                },
                CalendarAccount: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Account ID'
                        },
                        type: {
                            type: 'string',
                            enum: ['google', 'caldav'],
                            description: 'Account type'
                        },
                        serverUrl: {
                            type: 'string',
                            description: 'CalDAV server URL (for CalDAV accounts)'
                        },
                        username: {
                            type: 'string',
                            description: 'Username (for CalDAV accounts)'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and registration endpoints'
            },
            {
                name: 'Events',
                description: 'Event management endpoints'
            },
            {
                name: 'Users',
                description: 'User profile endpoints'
            },
            {
                name: 'Google',
                description: 'Google Calendar integration endpoints'
            },
            {
                name: 'CalDAV',
                description: 'CalDAV calendar integration endpoints'
            },
            {
                name: 'OIDC',
                description: 'OpenID Connect authentication endpoints'
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/server.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
