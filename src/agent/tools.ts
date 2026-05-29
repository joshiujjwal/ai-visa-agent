// src/agent/tools.ts
//
// GPT-4o tool definitions + implementations.
// Each tool is a pure function that accepts a Prisma client + params.
// This enables unit testing without a real DB connection.
//
// TODO (Phase 2): Implement all tools

export const toolDefinitions = [
  {
    type: 'function' as const,
    function: {
      name: 'get_country_requirements',
      description: 'Get visa requirements for a specific country and visa type',
      parameters: {
        type: 'object',
        properties: {
          country_code: {
            type: 'string',
            description: 'ISO 3166-1 alpha-2 country code (e.g. "US", "GB")',
          },
          visa_type: {
            type: 'string',
            description: 'Visa type (e.g. "tourist", "student", "work", "family")',
          },
        },
        required: ['country_code', 'visa_type'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'validate_document_checklist',
      description:
        'Check which required documents are still missing for an application',
      parameters: {
        type: 'object',
        properties: {
          application_id: {
            type: 'string',
            description: 'UUID of the visa application',
          },
        },
        required: ['application_id'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_timeline_estimate',
      description:
        'Return estimated processing timeline for a visa type and country',
      parameters: {
        type: 'object',
        properties: {
          country_code: { type: 'string' },
          visa_type: { type: 'string' },
          travel_date: {
            type: 'string',
            description: 'ISO 8601 date string (optional)',
          },
        },
        required: ['country_code', 'visa_type'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'update_application_status',
      description: 'Update the status of a visa application',
      parameters: {
        type: 'object',
        properties: {
          application_id: { type: 'string' },
          status: {
            type: 'string',
            enum: [
              'draft',
              'documents_pending',
              'submitted',
              'under_review',
              'approved',
              'rejected',
            ],
          },
        },
        required: ['application_id', 'status'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_application_summary',
      description: 'Return a full summary of the current application state',
      parameters: {
        type: 'object',
        properties: {
          application_id: { type: 'string' },
        },
        required: ['application_id'],
      },
    },
  },
];
