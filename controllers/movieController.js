const asyncHandler = require("express-async-handler");
const Movie = require("../models/movie");

/**
 * @description         Get all movies
 * @route               /movies
 * @method              GET
 * @access              protected (requires token)
 */
const getAllMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find({});
  return res.status(200).json(movies);
});

/**
 * @description         Get top rated movies
 * @route               /movies/get-top-rated-movies
 * @method              GET
 * @access              protected (requires token)
 */
const getTopRatedMovies = asyncHandler(async (req, res) => {
  try {
    const topRatedMovies = await Movie.find().sort({ rating: -1 }).limit(5);
    return res.status(200).json(topRatedMovies);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @description         Get movies per page
 * @route               /movies/movie-pages
 * @method              GET
 * @access              protected (requires token)
 */
const getMoviesPerPage = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  try {
    const movies = await Movie.find()
      .sort({ rating: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json(movies);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @description         Search movie
 * @route               /movies/search
 * @method              GET
 * @access              protected (requires token)
 */
const searchMovies = asyncHandler(async (req, res) => {
  let { title } = req.query;

  try {
    if (!title) {
      return res.status(400).json({ message: "Title parameter is missing" });
    }
    title = title.toLowerCase();
    const foundMovies = await Movie.find({
      title: { $regex: new RegExp(title, "i") },
    }).lean();
    if (foundMovies.length === 0) {
      return res
        .status(404)
        .json({ message: `No movies found with the title "${title}"` });
    }
    const matchingMovies = foundMovies.filter((movie) =>
      movie.title.toLowerCase().includes(title)
    );
    if (matchingMovies.length === 0) {
      return res
        .status(404)
        .json({ message: `No movies found with the title "${title}"` });
    }
    return res.status(200).json({ results: matchingMovies });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error searching for movies", error: error.message });
  }
});

/**
 * @description         Get movie details
 * @route               /movies/:movieId
 * @method              GET
 * @access              protected (requires token)
 */
const getMovieDetails = asyncHandler(async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.status(200).json({ movie });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching movie details", error: error.message });
  }
});

/**
 * @description         Get movie trailer
 * @route               /movies/:movieId/trailer
 * @method              GET
 * @access              protected (requires token)
 */
const getTrailer = asyncHandler(async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.status(200).json({ trailerLink: movie.trailerLink });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching trailer ", error: error.message });
  }
});

module.exports = {
  getAllMovies,
  getTopRatedMovies,
  getMoviesPerPage,
  searchMovies,
  getMovieDetails,
  getTrailer,
};
