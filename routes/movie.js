const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.verifyToken, movieController.getAllMovies);
router.get('/top-rated-movies',movieController.verifyToken, movieController.getTopRatedMovies);
router.get('/movie-pages', movieController.verifyToken, movieController.getMoviesPerPage);
router.post('/add-to-favorite',movieController.verifyToken,  movieController.addToFavorites);
router.delete('/remove-from-favorite', movieController.verifyToken,  movieController.removeMovieFromFavorites);
router.get('/get-favorite-movies', movieController.verifyToken,  movieController.getFavoritesMovies);
router.get('/search',movieController.verifyToken, movieController.searchMovies);
router.get('/:movieId',movieController.verifyToken, movieController.getMovieDetails);
router.get('/:movieId/trailer', movieController.verifyToken, movieController.getTrailer);


module.exports = router;