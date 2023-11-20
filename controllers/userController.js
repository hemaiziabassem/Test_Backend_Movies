const {
  User,
  validationRegisterUser,
  validationLoginUser,
} = require("../models/user");
const asynchandler = require("express-async-handler");
const Movie = require("../models/movie");
const Serie = require("../models/serie");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerController = asynchandler(async (req, res) => {
  let data = req.body;

  const { error } = await validationRegisterUser(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const existingUser = await User.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists." });
  }

  const user = new User(data);
  const salt = await bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  await user.save();

  return res.status(201).json(user);
});

/**
 * @description         login user
 * @route               /user/login
 * @method              POST
 * @access              public
 */
const loginController = asynchandler(async (req, res) => {
  let data = req.body;
  const { error } = await validationLoginUser(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ message: "invalid username or password" });
  }
  const isMatchPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isMatchPassword) {
    return res.status(400).json({ message: "invalid username or password" });
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET_KEY || "testMovieApi",
    { expiresIn: "24h" }
  );
  const { password, ...other } = user._doc;
  return res.status(200).json({ token });
});

/**
 * @description         Add movie or serie to favorite
 * @route               /user/add-to-favorite
 * @method              POST
 * @access              protected (requires token)
 */
const addToFavorites = asynchandler(async (req, res) => {
  const userId = req.user.id;
  const { mediaId, type } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let media;
    let favoritesArray;
    if (type === "movie") {
      media = await Movie.findById(mediaId);
      favoritesArray = "favoriteMovies";
    } else if (type === "serie") {
      media = await Serie.findById(mediaId);
      favoritesArray = "favoriteSeries";
    } else {
      return res.status(400).json({ message: "Invalid media type" });
    }
    if (!media) {
      return res.status(404).json({ message: `${type} not found` });
    }
    if (user[favoritesArray].includes(mediaId)) {
      return res
        .status(400)
        .json({ message: `${type} is already in favorites.` });
    }
    user[favoritesArray].push(mediaId);
    await user.save();
    return res.status(200).json({
      message: `${type} added to favorites successfully`,
      favorites: user[favoritesArray],
    });
  } catch (error) {
    return res.status(500).json({
      message: `Unable to add ${type} to favorites`,
      error: error.message,
    });
  }
});

/**
 * @description         Remove movie or serie from favorite
 * @route               /user/remove-from-favorite
 * @method              Delete
 * @access              protected (requires token)
 */
const removeFromFavorites = asynchandler(async (req, res) => {
  const userId = req.user.id;
  const { mediaId, type } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let favoritesArray;
    if (type === "movie") {
      favoritesArray = "favoriteMovies";
    } else if (type === "serie") {
      favoritesArray = "favoriteSeries";
    } else {
      return res.status(400).json({ message: "Invalid media type" });
    }
    if (!user[favoritesArray].includes(mediaId)) {
      return res.status(400).json({ message: `${type} is not in favorites.` });
    }
    user[favoritesArray] = user[favoritesArray].filter(
      (favMedia) => favMedia.toString() !== mediaId
    );
    await user.save();
    return res.status(200).json({
      message: `${type} deleted from favorites successfully`,
      favorites: user[favoritesArray],
    });
  } catch (error) {
    return res.status(500).json({
      message: `Unable to delete ${type} from favorites`,
      error: error.message,
    });
  }
});

/**
 * @description         Get favorite movies or series
 * @route               /user/favorites
 * @method              GET
 * @access              protected (requires token)
 */
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let favoriteMediaIds = [];
    if (type === "movie") {
      favoriteMediaIds = user.favoriteMovies;
    } else if (type === "serie") {
      favoriteMediaIds = user.favoriteSeries;
    } else {
      return res.status(400).json({ message: "Invalid type specified" });
    }
    let mediaDetails = [];
    if (type === "movie") {
      mediaDetails = await Movie.find({ _id: { $in: favoriteMediaIds } });
    } else if (type === "serie") {
      mediaDetails = await Serie.find({ _id: { $in: favoriteMediaIds } });
    }
    return res.json({ favorites: mediaDetails });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching favorites",
      error: error.message,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
};
