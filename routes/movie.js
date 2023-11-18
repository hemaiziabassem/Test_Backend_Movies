const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');



/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         trailer:
 *           type: string
 *         added_date:
 *           type: string
 *           format: date-time
 *         rating:
 *           type: number
 *
 */


/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Movie API
 *   version: 1.0.0
 *   description: API documentation for Movie CRUD operations
 *
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
 *       description: Retrieve all movies. Requires a valid JWT token.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *       - in: header
 *         name: token
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
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
router.get('/', movieController.verifyToken, movieController.getAllMovies);




/**
 * @swagger
 * /movies/top-rated-movies:
 *   get:
 *     summary: Get top-rated movies
 *     description: Retrieve top-rated movies
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: header
 *         name: token
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
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
router.get('/top-rated-movies',movieController.verifyToken, movieController.getTopRatedMovies);

/**
 * @swagger
 * /movies/movie-pages:
 *   get:
 *     summary: Get movies per page
 *     description: Retrieve movies paginated. Requires a valid JWT token passed in the Authorization header as Bearer token.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: header
 *         name: token
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A page of movies
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Movie'
 *       '401':
 *         description: Unauthorized, requires token
 */
router.get('/movie-pages', movieController.verifyToken, movieController.getMoviesPerPage);

/**
 * @swagger
 * /movies/add-to-favorite:
 *   post:
 *     summary: Add movie to favorites
 *     description: Add a movie to user's favorites. Requires a valid JWT token passed in the Authorization header as Bearer token.
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 description: ID of the movie to be added to favorites
 *             required:
 *               - movieId
 *     responses:
 *       '200':
 *         description: Movie added to favorites
 *       '401':
 *         description: Unauthorized, requires token
 */
router.post('/add-to-favorite',movieController.verifyToken,  movieController.addToFavorites);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT

/**
 * @swagger
 * /remove-from-favorite:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Remove a movie from favorites
 *     description: Remove a movie from the user's favorites list. Requires a valid JWT token passed in the Authorization header as Bearer token and a movie ID.
 *     parameters:
 *       - in: query
 *         name: movieId
 *         required: true
 *         description: ID of the movie to remove from favorites
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: JWT token in the format 'Bearer <token>'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie removed from favorites successfully
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       404:
 *         description: Movie not found in favorites
 */
router.delete('/remove-from-favorite', movieController.verifyToken,  movieController.removeMovieFromFavorites);


router.get('/get-favorite-movies', movieController.verifyToken,  movieController.getFavoritesMovies);

router.get('/search',movieController.verifyToken, movieController.searchMovies);
router.get('/:movieId',movieController.verifyToken, movieController.getMovieDetails);
router.get('/:movieId/trailer', movieController.verifyToken, movieController.getTrailer);


module.exports = router;