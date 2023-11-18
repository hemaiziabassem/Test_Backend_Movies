const asyncHandler = require('express-async-handler');
const {Movie} = require('../models/movie');
const jwt = require('jsonwebtoken');

const {User} = require('../models/user');




const verifyToken = (req, res, next) => {
    
     const token = req.headers.token;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({message: "invalid token"})
        }
    }else{
        res.status(401).json({message: "no token provided!!"});
    }
};



/**
 * @description         Get all movies
 * @route               /movies
 * @method              GET
 * @access              protected (requires token)
 */
const getAllMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find({});
    res.status(200).json(movies);
});




/**
 * @description         Get top rated movies
 * @route               /movies/get-top-rated-movies
 * @method              GET
 * @access              protected (requires token)
 */
const getTopRatedMovies = asyncHandler( async (req, res) => {
    try {
        const topRatedMovies = await Movie.find().sort({ rating: -1 }).limit(5);
        res.status(200).json(topRatedMovies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});




/**
 * @description         Get movies per page
 * @route               /movies/movie-pages
 * @method              GET
 * @access              protected (requires token)
 */
const getMoviesPerPage = asyncHandler( async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10; 

    try {
        const movies = await Movie.find()
            .sort({ rating: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});





/**
 * @description         Add movie to favorite
 * @route               /movies/add-to-favorite
 * @method              POST
 * @access              protected (requires token)
 */
const addToFavorites = asyncHandler( async (req, res) => {
    const userId = req.user.id;
    const { movieId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      if (user.favoriteMovies.includes(movieId)) {
        return res.status(400).json({ message: 'Movie is already in favorites.' });
      }
      user.favoriteMovies.push(movieId);
      await user.save();
  
      return res.status(200).json({ message: 'Movie added to favorites successfully', favorites: user.favoriteMovies });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to add movie to favorites', error: error.message });
    }
  });

  




/**
 * @description         Remove movie from favorite
 * @route               /movies/remove-from-favorite
 * @method              DELETE
 * @access              protected (requires token)
 */
const removeMovieFromFavorites = asyncHandler( async (req, res) => {
    const userId  = req.user.id;
    const { movieId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.favoriteMovies.includes(movieId)) {
        return res.status(400).json({ message: 'Movie is not in favorites.' });
      }
  
      user.favoriteMovies = user.favoriteMovies.filter(favMovie => favMovie.toString() !== movieId);
      await user.save();
  
      return res.status(200).json({ message: 'Movie removed from favorites successfully', favorites: user.favoriteMovies });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to remove movie from favorites', error: error.message });
    }
  });
  



/**
 * @description         Get favorite movies
 * @route               /movies/get-favorite-movies
 * @method              GET
 * @access              protected (requires token)
 */
const getFavoritesMovies = asyncHandler(async (req, res) => {
    const userId = req.user.id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const favoriteMovies = user.favoriteMovies;
  
      return res.status(200).json({ favorites: favoriteMovies });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to fetch user favorites', error: error.message });
    }
  });




 /**
 * @description         Search movie
 * @route               /movies/search
 * @method              GET
 * @access              protected (requires token)
 */
const searchMovies = asyncHandler(async (req, res) => {
  const { title } = req.body;

  try {
    const foundMovies = await Movie.find({ title: { $regex: new RegExp(title, 'i') } });

    return res.status(200).json({ results: foundMovies });
  } catch (error) {
    return res.status(500).json({ message: 'Error searching for movies', error: error.message });
  }
});



 /**
 * @description         Get movie details
 * @route               /movies/:movieId
 * @method              GET
 * @access              protected (requires token)
 */
const getMovieDetails =asyncHandler( async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.status(200).json({ movie });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching movie details', error: error.message });
  }
});



 /**
 * @description         Get movie trailer
 * @route               /movies/:movieId/trailer
 * @method              GET
 * @access              protected (requires token)
 */
const getTrailer = asyncHandler( async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    return res.status(200).json({ trailerLink: movie.trailerLink });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching trailer ', error: error.message });
  }
});




module.exports = {
    getAllMovies,
    verifyToken,
    getTopRatedMovies,
    getMoviesPerPage,
    addToFavorites,
    removeMovieFromFavorites,
    getFavoritesMovies,
    searchMovies,
    getMovieDetails,
    getTrailer,
};
