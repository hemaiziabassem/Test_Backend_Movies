const express = require('express');
const router = express.Router();
const serieController = require('../controllers/serieController');
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


router.get('/', serieController.verifyToken, serieController.getAllSeries);
router.get('/top-rated-series', serieController.verifyToken, serieController.getTopRatedSeries);
router.get('/serie-pages', serieController.verifyToken, serieController.getSeriesPerPage);
router.post('/add-to-favorite', serieController.verifyToken, serieController.addToFavorites);
router.delete('/remove-from-favorite', serieController.verifyToken, serieController.removeFromFavorites);
router.get('/get-favorite-series', serieController.verifyToken, serieController.getFavoriteSeries);
router.get('/search',serieController.verifyToken, serieController.searchSeries);
router.get('/:seriesId',serieController.verifyToken, serieController.getSeriesDetails);
router.get('/:seriesId/trailer', serieController.verifyToken, serieController.getTrailer);

module.exports = router;