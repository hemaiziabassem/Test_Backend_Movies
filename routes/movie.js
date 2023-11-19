const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { verifyToken } = require("../middlewares/verifyToken");

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: 'object'
 *       properties:
 *         title:
 *           type: 'string'
 *         description:
 *           type: 'string'
 *         image:
 *           type: 'string'
 *         trailer:
 *           type: 'string'
 *         added_date:
 *           type: 'string'
 *           format: 'date-time'
 *         rating:
 *           type: 'number'
 */
/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Movie API
 *   version: 1.0.0
 *   description: API documentation for Movie CRUD operations
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * paths:
 *   /movies:
 *     get:
 *       summary: Get all movies
 *       description: Retrieve all movies.
 *       tags: [Movies]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: A list of movies.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Movie'
 */
router.get("/", verifyToken, movieController.getAllMovies);

/**
 * @swagger
 * /movies/top-rated-movies:
 *   get:
 *     summary: Get top-rated movies
 *     description: Retrieve top-rated movies
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of top-rated movies
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Movie'
 *       '401':
 *         description: Unauthorized, requires token
 */
router.get("/top-rated-movies", verifyToken, movieController.getTopRatedMovies);

/**
 * @swagger
 * /movies/movie-pages:
 *   get:
 *     summary: Get movies with pagination.
 *     description: Retrieve a paginated list of movies.
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve (default is 1).
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Number of movies per page (default is 10).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response, returns paginated movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Server Error.
 */

router.get("/movie-pages", verifyToken, movieController.getMoviesPerPage);

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies
 *     description: Endpoint to search movies
 *     tags:
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Title of the series to search
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/search", verifyToken, movieController.searchMovies);

/**
 * @swagger
 * /movies/{movieId}:
 *   get:
 *     summary: Get movie details
 *     description: Retrieve details of a specific movie
 *     tags:
 *       - Movies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to retrieve details
 *     responses:
 *       '200':
 *         description: Successful response
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Movie not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:movieId", verifyToken, movieController.getMovieDetails);

module.exports = router;
