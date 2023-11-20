const asyncHandler = require("express-async-handler");
const Serie = require("../models/serie");

/**
 * @description         Get all series
 * @route               /series
 * @method              GET
 * @access              protected (requires token)
 */
const getAllSeries = asyncHandler(async (req, res) => {
  const series = await Serie.find({});
  return res.status(200).json(series);
});

/**
 * @description         Get top rated series
 * @route               /series/get-top-rated-series
 * @method              GET
 * @access              protected (requires token)
 */
const getTopRatedSeries = asyncHandler(async (req, res) => {
  try {
    const topRatedSeries = await Serie.find().sort({ rating: -1 }).limit(5);
    return res.status(200).json(topRatedSeries);
  } catch (error) {
    return res.status(500).json({ message: " Server Error" });
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
  const perPage = parseInt(req.query.perPage) || 10;
  try {
    const series = await Serie.find()
      .sort({ rating: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    return res.status(200).json(series);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @description         Search series by title
 * @route               /series/search
 * @method              GET
 * @access              protected (requires token)
 */
const searchSeries = asyncHandler(async (req, res) => {
  let { title } = req.query;

  try {
    if (!title) {
      return res.status(400).json({ message: "Title parameter is missing" });
    }
    title = title.toLowerCase();
    const foundSeries = await Serie.find({
      title: { $regex: new RegExp(title, "i") },
    }).lean();
    if (foundSeries.length === 0) {
      return res
        .status(404)
        .json({ message: `No series found with the title "${title}"` });
    }
    const matchingSeries = foundSeries.filter((series) =>
      series.title.toLowerCase().includes(title)
    );

    if (matchingSeries.length === 0) {
      return res
        .status(404)
        .json({ message: `No series found with the title "${title}"` });
    }
    return res.status(200).json({ results: matchingSeries });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error searching for series", error: error.message });
  }
});

/**
 * @description         get series details
 * @route               /series/:seriesId
 * @method              GET
 * @access              protected (requires token)
 */
const getSeriesDetails = asyncHandler(async (req, res) => {
  const seriesId = req.params.seriesId;
  try {
    const series = await Serie.findById(seriesId);
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }
    return res.status(200).json({ series });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching series details", error: error.message });
  }
});

/**
 * @description         get trailer
 * @route               /series/:seriesId/trailer
 * @method              GET
 * @access              protected (requires token)
 */
const getTrailer = asyncHandler(async (req, res) => {
  const seriesId = req.params.seriesId;
  try {
    const serie = await Serie.findById(seriesId);
    if (!serie) {
      return res.status(404).json({ message: "Series not found" });
    }
    return res.status(200).json({ trailerLink: serie.trailerLink });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching trailer", error: error.message });
  }
});

module.exports = {
  getAllSeries,
  getTopRatedSeries,
  getSeriesPerPage,
  searchSeries,
  getSeriesDetails,
  getTrailer,
};
