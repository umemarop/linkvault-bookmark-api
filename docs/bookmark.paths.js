const bookmarkPaths = {
  "/bookmarks": {
    get: {
      tags: ["Bookmarks"],
      summary: "Get all bookmarks",
      description:
        "Retrieve all bookmarks with filtering, searching, sorting, field limiting, and pagination.",
      parameters: [
        {
          name: "category",
          in: "query",
          schema: {
            type: "string",
            enum: ["dev", "design", "career", "productivity", "etc"],
          },
          description: "Filter bookmarks by category",
        },
        {
          name: "tags",
          in: "query",
          schema: {
            type: "string",
          },
          description: "Filter bookmarks by tag",
        },
        {
          name: "isFavorite",
          in: "query",
          schema: {
            type: "string",
            enum: ["true", "false"],
          },
          description: "Filter bookmarks by favorite status",
        },
        {
          name: "search",
          in: "query",
          schema: {
            type: "string",
          },
          description: "Search in title, description, and url",
        },
        {
          name: "sort",
          in: "query",
          schema: {
            type: "string",
            example: "latest",
          },
          description: "Sort option: latest, oldest, az, za",
        },
        {
          name: "fields",
          in: "query",
          schema: {
            type: "string",
            example: "title,url,category",
          },
          description: "Select specific fields to include in response",
        },
        {
          name: "page",
          in: "query",
          schema: {
            type: "integer",
            example: 1,
          },
          description: "Page number",
        },
        {
          name: "limit",
          in: "query",
          schema: {
            type: "integer",
            example: 10,
          },
          description: "Number of items per page",
        },
      ],
      responses: {
        200: {
          description: "Bookmarks retrieved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BookmarksResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid query parameters",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              examples: {
                invalidFavorite: {
                  summary: "Invalid isFavorite value",
                  value: {
                    status: "fail",
                    message:
                      "Invalid value for isFavorite. Please use 'true' or 'false'.",
                  },
                },
                invalidSort: {
                  summary: "Invalid sort value",
                  value: {
                    status: "fail",
                    message: "Invalid sort options: wrongSort.",
                  },
                },
                invalidFields: {
                  summary: "Invalid field selection",
                  value: {
                    status: "fail",
                    message: "Invalid field selections: wrongField.",
                  },
                },
                invalidPage: {
                  summary: "Invalid page number",
                  value: {
                    status: "fail",
                    message: "Page must be a positive integer.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "error",
                message: "Something went wrong!",
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Bookmarks"],
      summary: "Create a new bookmark",
      description: "Create and save a new bookmark.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/BookmarkInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Bookmark created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BookmarkResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid input data",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              examples: {
                validationError: {
                  summary: "Validation failed",
                  value: {
                    status: "fail",
                    message:
                      "Invalid input data. A bookmark must have a name. A bookmark must have a url.",
                  },
                },
                duplicateTitle: {
                  summary: "Duplicate title",
                  value: {
                    status: "fail",
                    message:
                      'Duplicate field value: "Google" for field "title". Please use another value!',
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "error",
                message: "Something went wrong!",
              },
            },
          },
        },
      },
    },
  },

  "/bookmarks/{id}": {
    get: {
      tags: ["Bookmarks"],
      summary: "Get a bookmark by ID",
      description: "Retrieve a single bookmark by its MongoDB ObjectId.",
      parameters: [
        {
          $ref: "#/components/parameters/BookmarkId",
        },
      ],
      responses: {
        200: {
          description: "Bookmark retrieved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BookmarkResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid bookmark ID",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "fail",
                message: "Invalid _id: invalid-id.",
              },
            },
          },
        },
        404: {
          description: "Bookmark not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "fail",
                message: "No bookmark found with that ID",
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "error",
                message: "Something went wrong!",
              },
            },
          },
        },
      },
    },

    patch: {
      tags: ["Bookmarks"],
      summary: "Update a bookmark by ID",
      description: "Update an existing bookmark by its MongoDB ObjectId.",
      parameters: [
        {
          $ref: "#/components/parameters/BookmarkId",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/BookmarkUpdateInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Bookmark updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BookmarkResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid ID or invalid input data",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              examples: {
                invalidId: {
                  summary: "Invalid ObjectId",
                  value: {
                    status: "fail",
                    message: "Invalid _id: invalid-id.",
                  },
                },
                validationError: {
                  summary: "Validation failed",
                  value: {
                    status: "fail",
                    message: "Invalid input data. Please provide a valid URL.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Bookmark not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "fail",
                message: "No bookmark found with that ID",
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "error",
                message: "Something went wrong!",
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ["Bookmarks"],
      summary: "Delete a bookmark by ID",
      description: "Delete a bookmark by its MongoDB ObjectId.",
      parameters: [
        {
          $ref: "#/components/parameters/BookmarkId",
        },
      ],
      responses: {
        204: {
          description: "Bookmark deleted successfully",
        },
        400: {
          description: "Invalid bookmark ID",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "fail",
                message: "Invalid _id: invalid-id.",
              },
            },
          },
        },
        404: {
          description: "Bookmark not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "fail",
                message: "No bookmark found with that ID",
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                status: "error",
                message: "Something went wrong!",
              },
            },
          },
        },
      },
    },
  },
};

module.exports = bookmarkPaths;
