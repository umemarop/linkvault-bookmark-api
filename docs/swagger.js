const swaggerJSDoc = require("swagger-jsdoc");
const components = require("./components");
const bookmarkPaths = require("./bookmark.paths");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LinkVault API",
      version: "1.0.0",
      contact: {
        name: "Sanghun Han",
        email: "umemarop@gmail.com",
      },
      description:
        "A RESTful Bookmark API for saving, retrieving, searching, and filtering bookmarks efficiently",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Local server",
      },
    ],
    tags: [
      {
        name: "Bookmarks",
        description: "Bookmark management endpoints",
      },
    ],
    components,
    paths: {
      ...bookmarkPaths,
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
