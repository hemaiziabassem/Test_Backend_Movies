const asyncHandler = require('express-async-handler');
const {Series} = require('../models/serie');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');



const verifyToken = (req, res, next) => {
    const token = req.headers.token; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = decoded.id;
        next(); 
    });
};


/**
 * @description         Get all series
 * @route               /series
 * @method              GET
 * @access              protected (requires token)
 */
const getAllSeries = asyncHandler(async (req, res) => {
    const series = await Series.find({});
    res.status(200).json(series);
});


/**
 * @description         Get top rated series
 * @route               /series/get-top-rated-series
 * @method              GET
 * @access              protected (requires token)
 */
const getTopRatedSeries = asyncHandler( async (req, res) => {
    try {
        const topRatedSeries = await Series.find().sort({ rating: -1 }).limit(5);
        res.status(200).json(topRatedSeries);
    } catch (error) {
        res.status(500).json({ message: ' Server Error' });
    }
});


/**
 * @description         Get series per page
 * @route               /series/serie-pages
 * @method              GET
 * @access              protected (requires token)
 */
const getSeriesPerPage = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
  
    try {
      const series = await Serie.find()
        .sort({ rating: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
      res.status(200).json(series);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });


/**
 * @description         Add serie to favorite
 * @route               /series/add-to-favorite
 * @method              POST
 * @access              protected (requires token)
 */
const addToFavorites = asyncHandler(async (req, res) => {
    const userId  = req.user.id;
    const { serieId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const serie = await Serie.findById(serieId);
      if (!serie) {
        return res.status(404).json({ message: 'Serie not found' });
      }
      if (user.favoriteSeries.includes(serieId)) {
        return res.status(400).json({ message: 'Serie is already in favorites.' });
      }
      user.favoriteSeries.push(serieId);
      await user.save();
      return res.status(200).json({ message: 'Serie added to favorites successfully', favorites: user.favoriteSeries });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to add serie to favorites', error: error.message });
    }
  });


/**
 * @description         Remove serie from favorite
 * @route               /series/remove-from-favorite
 * @method              DELETE
 * @access              protected (requires token)
 */
  const removeFromFavorites = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { seriesId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.favoriteSeries.includes(seriesId)) {
        return res.status(400).json({ message: 'Series is not in favorites.' });
      }
  
      user.favoriteSeries = user.favoriteSeries.filter(
        favSeries => favSeries.toString() !== seriesId
      );
      await user.save();
  
      return res.status(200).json({
        message: 'Series removed from favorites successfully',
        favorites: user.favoriteSeries,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to remove series from favorites',
        error: error.message,
      });
    }
  }); 
  

/**
 * @description         get favorite series
 * @route               /series/get-favorite-series
 * @method              GET
 * @access              protected (requires token)
 */
  const getFavoriteSeries = asyncHandler(async (req, res) => {
    const userId = req.user.id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const favoriteSeries = user.favoriteSeries;
  
      return res.status(200).json({ favorites: favoriteSeries });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to fetch user favorite series', error: error.message });
    }
  });


/**
 * @description         Search series
 * @route               /series/search
 * @method              GET
 * @access              protected (requires token)
 */
const searchSeries = asyncHandler(async (req, res) => {
    const { title } = req.body;
  
    try {
      const foundSeries = await Serie.find({ title: { $regex: new RegExp(title, 'i') } });
  
      return res.status(200).json({ results: foundSeries });
    } catch (error) {
      return res.status(500).json({ message: 'Error searching for series', error: error.message });
    }
  });


/**
 * @description         get series details
 * @route               /series/:seriesId
 * @method              GET
 * @access              protected (requires token)
 */
const getSeriesDetails = asyncHandler( async (req, res) => {
    const seriesId = req.params.seriesId;
    try {
      const series = await Serie.findById(seriesId);
      if (!series) {
        return res.status(404).json({ message: 'Series not found' });
      }
      return res.status(200).json({ series });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching series details', error: error.message });
    }
  });


 /**
 * @description         get trailer
 * @route               /series/:seriesId/trailer
 * @method              GET
 * @access              protected (requires token)
 */
const getTrailer = asyncHandler( async (req, res) => {
    const seriesId = req.params.seriesId;
    try {
      const serie = await Serie.findById(seriesId);
      if (!serie) {
        return res.status(404).json({ message: 'Series not found' });
      }
      return res.status(200).json({ trailerLink: serie.trailerLink });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching trailer', error: error.message });
    }
  });
  

module.exports = {
    getAllSeries,
    verifyToken,
    getTopRatedSeries,
    getSeriesPerPage,
    addToFavorites,
    removeFromFavorites,
    getFavoriteSeries,
    searchSeries,
    getSeriesDetails,
    getTrailer,
};
