const express = require("express");
const {
  loginController,
  registerController,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} = require("../controllers/userController");
const { loginLimiter, registerLimiter } = require("../middlewares/limiter");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *           unique: true
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *           unique: true
 *         password:
 *           type: string
 *           description: User's password
 *         favoriteMovies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Movie'
 *           description: Array of favorite movies' ObjectIds
 *         favoriteSeries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Serie'
 *           description: Array of favorite series' ObjectIds
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - trailer
 *       properties:
 *         title:
 *           type: string
 *           description: Movie's title
 *         description:
 *           type: string
 *           description: Movie's description
 *         image:
 *           type: string
 *           description: URL to movie's image
 *         trailer:
 *           type: string
 *           description: URL to movie's trailer
 *         added_date:
 *           type: string
 *           format: date-time
 *           description: Date the movie was added
 *         rating:
 *           type: number
 *           description: Movie's rating
 *     Serie:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - trailer
 *         - numberOfEpisodes
 *         - seasons
 *       properties:
 *         title:
 *           type: string
 *           description: Serie's title
 *         description:
 *           type: string
 *           description: Serie's description
 *         image:
 *           type: string
 *           description: URL to serie's image
 *         trailer:
 *           type: string
 *           description: URL to serie's trailer
 *         added_date:
 *           type: string
 *           format: date-time
 *           description: Date the serie was added
 *         rating:
 *           type: number
 *           description: Serie's rating
 *         numberOfEpisodes:
 *           type: number
 *           description: Total number of episodes in the serie
 *         seasons:
 *           type: number
 *           description: Total number of seasons in the serie
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with required parameters for testing.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       '201':
 *         description: User successfully registered
 *       '400':
 *         description: Invalid request body
 */
router.post("/register", registerLimiter, registerController);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login for existing user
 *     description: Login for an existing user with required parameters for testing.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       '200':
 *         description: User successfully logged in
 *       '401':
 *         description: Unauthorized, invalid credentials
 */
router.post("/login", loginLimiter, loginController);

/**
 * @swagger
 * /user/add-to-favorite:
 *   post:
 *     summary: Add a movie or series to favorites
 *     description: Add a movie or series to a user's favorites list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaId:
 *                 type: string
 *                 description: ID of the movie or series
 *               type:
 *                 type: string
 *                 description: Type of media ("movie" or "serie")
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 favorites:
 *                   type: array
 *                   description: Updated favorites array
 *       400:
 *         description: Invalid media type or already in favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       404:
 *         description: User not found or media not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Unable to add media to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post("/add-to-favorite", verifyToken, addToFavorites);

/**
 * @swagger
 * /user/delete-from-favorites:
 *   delete:
 *     summary: Delete a movie or series from favorites
 *     description: Remove a movie or series from a user's favorites list
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # If authentication is required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaId:
 *                 type: string
 *                 description: ID of the movie or series to delete
 *               type:
 *                 type: string
 *                 description: Type of media ("movie" or "serie")
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 favorites:
 *                   type: array
 *                   description: Updated favorites array
 *       400:
 *         description: Invalid media type or not found in favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       404:
 *         description: User not found or media not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Unable to delete media from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

router.delete("/delete-from-favorites", verifyToken, removeFromFavorites);

/**
 * @swagger
 * /user/favorite:
 *   get:
 *     summary: Get user's favorite movies or series.
 *     description: Retrieve the user's favorite movies or series based on the specified media type (movie or serie).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type of media (movie or serie)
 *     responses:
 *       200:
 *         description: Successful response, returns user's favorite movies or series.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorites:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - $ref: '#/components/schemas/Movie'
 *                       - $ref: '#/components/schemas/Serie'
 *       400:
 *         description: Invalid request format or missing parameters.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

router.get("/favorite", verifyToken, getFavorites);

//router.get("/:id/favorite", favoriteController);

module.exports = router;
