const express = require("express");
const router = express.Router();
const serieController = require("../controllers/serieController");
const { verifyToken } = require("../middlewares/verifyToken");
/**
 * @swagger
 * components:
 *   schemas:
 *     Serie:
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
/**
 * @swagger
 * /series:
 *   get:
 *     summary: Get all series
 *     description: Retrieve all series.
 *     tags:
 *       - Series
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response, returns all series.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Serie'
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.get("/", verifyToken, serieController.getAllSeries);

/**
 * @swagger
 * /series/top-rated-series:
 *   get:
 *     summary: Get top-rated series
 *     description: Retrieve top-rated series.
 *     tags:
 *       - Series
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response, returns top-rated series.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Serie'
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.get("/top-rated-series", verifyToken, serieController.getTopRatedSeries);

/**
 * @swagger
 * /series/serie-pages:
 *   get:
 *     summary: Get series with pagination.
 *     description: Retrieve a paginated list of series.
 *     tags:
 *       - Series
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
 *         description: Number of series per page (default is 10).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response, returns paginated series.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Serie'
 *       500:
 *         description: Server Error.
 */

router.get("/serie-pages", verifyToken, serieController.getSeriesPerPage);

/**
 * @swagger
 * /series/search:
 *   get:
 *     summary: Search series
 *     description: Endpoint to search series
 *     tags:
 *       - Series
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
 *                 $ref: '#/components/schemas/Serie'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/search", verifyToken, serieController.searchSeries);

/**
 * @swagger
 * /series/{seriesId}:
 *   get:
 *     summary: Get series details
 *     description: Retrieve details of a specific series
 *     tags:
 *       - Series
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seriesId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the series to retrieve details
 *     responses:
 *       '200':
 *         description: Successful response
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Series not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:seriesId", verifyToken, serieController.getSeriesDetails);

module.exports = router;
