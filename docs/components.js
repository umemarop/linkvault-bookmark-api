const components = {
  schemas: {
    Bookmark: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          example: "65f1a2b3c4d5e6f7890abcde",
        },
        title: {
          type: "string",
          example: "OpenAI",
          maxLength: 40,
          minLength: 1,
        },
        url: {
          type: "string",
          format: "uri",
          example: "https://openai.com",
        },
        slug: {
          type: "string",
          example: "openai",
        },
        description: {
          type: "string",
          example: "AI research and deployment company",
          maxLength: 200,
        },
        category: {
          type: "string",
          enum: ["dev", "design", "career", "productivity", "etc"],
          example: "dev",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          example: ["ai", "tools"],
        },
        isFavorite: {
          type: "boolean",
          example: true,
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2026-03-25T10:00:00.000Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2026-03-25T10:30:00.000Z",
        },
      },
    },

    BookmarkInput: {
      type: "object",
      required: ["title", "url", "category"],
      properties: {
        title: {
          type: "string",
          minLength: 1,
          maxLength: 40,
          example: "OpenAI",
        },
        url: {
          type: "string",
          format: "uri",
          example: "https://openai.com",
        },
        description: {
          type: "string",
          maxLength: 200,
          example: "AI research and deployment company",
        },
        category: {
          type: "string",
          enum: ["dev", "design", "career", "productivity", "etc"],
          example: "dev",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          example: ["ai", "tools"],
        },
        isFavorite: {
          type: "boolean",
          example: false,
        },
      },
    },

    BookmarkUpdateInput: {
      type: "object",
      properties: {
        title: {
          type: "string",
          minLength: 1,
          maxLength: 40,
          example: "Updated OpenAI",
        },
        url: {
          type: "string",
          format: "uri",
          example: "https://openai.com/blog",
        },
        description: {
          type: "string",
          maxLength: 200,
          example: "Updated description",
        },
        category: {
          type: "string",
          enum: ["dev", "design", "career", "productivity", "etc"],
          example: "productivity",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          example: ["updated", "favorite"],
        },
        isFavorite: {
          type: "boolean",
          example: true,
        },
      },
      additionalProperties: false,
    },

    BookmarkResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        data: {
          type: "object",
          properties: {
            bookmark: {
              $ref: "#/components/schemas/Bookmark",
            },
          },
        },
      },
    },

    BookmarksResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        results: {
          type: "integer",
          example: 2,
        },
        pagination: {
          type: "object",
          properties: {
            total: {
              type: "integer",
              example: 25,
            },
            totalPages: {
              type: "integer",
              example: 3,
            },
            currentPage: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
          },
        },
        data: {
          type: "object",
          properties: {
            bookmarks: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Bookmark",
              },
            },
          },
        },
      },
    },

    ErrorResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "fail",
        },
        message: {
          type: "string",
          example: "No bookmark found with that ID",
        },
      },
    },
  },

  parameters: {
    BookmarkId: {
      name: "id",
      in: "path",
      required: true,
      description: "MongoDB ObjectId of the bookmark",
      schema: {
        type: "string",
        example: "65f1a2b3c4d5e6f7890abcde",
      },
    },
  },
};

module.exports = components;
