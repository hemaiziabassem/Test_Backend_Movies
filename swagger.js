const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Test Backend Movies Documentation",
      version: "1.0.0",
      description:
        "Creation of the backend (Rest API + database) of a web application: Movie app FlixFlex.",
      contact: {
        name: "Bassem HEMAIZIA",
        email: "hemaiziabassem@gmail.com",
        url: "https://github.com/hemaiziabassem",
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      securityDefinitions: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
