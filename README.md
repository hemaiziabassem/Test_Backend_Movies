# FlixFlex - Backend Movie API

This repository contains the backend (REST API + database) for FlixFlex, a web application to manage movies and series.

## Prerequisites

Before running the API, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/hemaiziabassem/Test_Backend_Movies.git
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Run the application:

    ```bash
    npm start
    ```

   The API will start running on http://localhost:3000 by default.
## Data Import Instructions

### Importing Movies Data

The movies data is available in the JSON format within the `data/movies.json` file. To add this data to your MongoDB database, you can use the `mongoimport` command.

#### Steps to Import Movies Data:

1. **Access the MongoDB Server:**
    ```bash
    # Replace 'username', 'password', and 'your_cluster_uri' with your MongoDB credentials and cluster URI
    mongo "mongodb+srv://username:password@your_cluster_uri"
    ```

2. **Navigate to the Directory Containing `movies.json`:**
    ```bash
    cd path_to_your_project/data
    ```

3. **Execute `mongoimport` Command:**
    ```bash
    # Replace 'your_database' with your MongoDB database name
    mongoimport --uri="mongodb+srv://username:password@your_cluster_uri/your_database" --collection=movies --file=movies.json --jsonArray
    ```

   This command imports the `movies.json` file into the `movies` collection within your specified database.

### Importing Series Data

The series data is available in the JSON format within the `data/series.json` file. Similar to the movies import, you can add this data to your MongoDB database using `mongoimport`.

#### Steps to Import Series Data:

1. **Access the MongoDB Server:** (If not already connected)
    ```bash
    mongo "mongodb+srv://username:password@your_cluster_uri"
    ```

2. **Navigate to the Directory Containing `series.json`:**
    ```bash
    cd path_to_your_project/data
    ```

3. **Execute `mongoimport` Command:**
    ```bash
    # Replace 'your_database' with your MongoDB database name
    mongoimport --uri="mongodb+srv://username:password@your_cluster_uri/your_database" --collection=series --file=series.json --jsonArray
    ```

   This command imports the `series.json` file into the `series` collection within your specified database.





## API Endpoints

### Users

#### Create User

- **Endpoint:** POST /user
- **Description:** Create a new user.
- **Request Body:**

    ```json
    {
        "username": "example",
        "email": "example@example.com",
        "password": "passwordexample"
    }
    ```

- **Response:**

    ```json
    {
        "_id": "60952e087e80b61f74e67db4",
        "username": "example",
        "email": "example@example.com",
        "createdAt": "2023-11-20T12:00:00.000Z",
        "updatedAt": "2023-11-20T12:00:00.000Z",
        "__v": 0
    }
    ```

#### Login User

- **Endpoint:** POST /user
- **Description:** Login user.
- **Request Body:**

    ```json
    {
        "username": "example",
        "password": "passwordexample"
    }
    ```

- **Response:**

    ```json
    {
        "message": "Login successful",
        "token": "<authentication_token>"
    }
    ```

#### Add to Favorites

- **Endpoint:** POST /user/add-to-favorite
- **Description:** Add a movie or series to favorites.
- **Request Body:**

    ```json
    {
        "mediaId": "movieOrSeriesID",
        "type": "movie" // or "serie"
    }
    ```

- **Response:**

    ```json
    {
        "message": "Added to favorites successfully",
        "favorites": [
            {
                "title": "Movie Title",
                // Other movie/series details
            }
        ]
    }
    ```

#### Delete from Favorites

- **Endpoint:** DELETE /user/delete-from-favorites
- **Description:** Delete a movie or series from favorites.
- **Request Body:**

    ```json
    {
        "mediaId": "movieOrSeriesID",
        "type": "movie" // or "serie"
    }
    ```

- **Response:**

    ```json
    {
        "message": "Deleted from favorites successfully",
        "favorites": [
            {
                "title": "Movie Title",
                // Other movie/series details
            }
        ]
    }
    ```

#### Get Favorites

- **Endpoint:** GET /user/favorite
- **Description:** Get user's favorite movies or series.
- **Query Parameters:**
    - `type` (string): Type of media (movie or serie).

- **Response:**

    ```json
    {
        "favorites": [
            {
                "title": "Movie Title",
                // Other movie/series details
            },
            {
                "title": "Another Movie Title",
                // Other movie/series details
            }
        ]
    }
    ```


### Movies

#### Get All Movies

- **Endpoint:** GET /movies
- **Description:** Retrieve all movies.
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    [
        {
            "title": "Movie Title",
            "description": "Movie Description",
            "image": "URL_to_Image",
            "trailer": "URL_to_Trailer",
            "added_date": "2023-11-20T12:00:00Z",
            "rating": 8.5
        },
        {
            "title": "Another Movie",
            "description": "Description of Another Movie",
            "image": "Another_Image_URL",
            "trailer": "Another_Trailer_URL",
            "added_date": "2023-11-21T10:30:00Z",
            "rating": 7.9
        },
        ...
    ]
    ```

#### Get Top-Rated Movies

- **Endpoint:** GET /movies/top-rated-movies
- **Description:** Retrieve top-rated movies.
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    [
        {
            "title": "Top Rated Movie",
            "description": "Description of Top Rated Movie",
            "image": "Top_Rated_Image_URL",
            "trailer": "Top_Rated_Trailer_URL",
            "added_date": "2023-11-20T15:45:00Z",
            "rating": 9.2
        },
        ...
    ]
    ```

#### Get Movies with Pagination

- **Endpoint:** GET /movies/movie-pages
- **Description:** Retrieve a paginated list of movies.
- **Parameters:**
    - `page` (integer): The page number to retrieve (default is 1).
    - `perPage` (integer): Number of movies per page (default is 10).
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    [
        {
            "title": "Movie 1",
            "description": "Description of Movie 1",
            "image": "Movie1_Image_URL",
            "trailer": "Movie1_Trailer_URL",
            "added_date": "2023-11-20T08:00:00Z",
            "rating": 7.1
        },
        ...
    ]
    ```

#### Search Movies

- **Endpoint:** GET /movies/search
- **Description:** Search movies by title.
- **Parameters:**
    - `title` (string): Title of the movie to search.
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    [
        {
            "title": "Search Result Movie",
            "description": "Description of Search Result Movie",
            "image": "Search_Result_Image_URL",
            "trailer": "Search_Result_Trailer_URL",
            "added_date": "2023-11-21T09:00:00Z",
            "rating": 8.0
        },
        ...
    ]
    ```

#### Get Movie Details

- **Endpoint:** GET /movies/{movieId}
- **Description:** Retrieve details of a specific movie by ID.
- **Parameters:**
    - `movieId` (string): ID of the movie to retrieve details.
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    {
        "title": "Specific Movie",
        "description": "Description of Specific Movie",
        "image": "Specific_Movie_Image_URL",
        "trailer": "Specific_Movie_Trailer_URL",
        "added_date": "2023-11-20T14:20:00Z",
        "rating": 8.7
    }
    ```
    
### Series 

#### Get All Series

- **Endpoint:** GET /series
- **Description:** Retrieve all series.
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    [
        {
            "title": "Series Title",
            "description": "Series Description",
            "image": "URL_to_Image",
            "trailer": "URL_to_Trailer",
            "added_date": "2023-11-20T12:00:00Z",
            "rating": 8.5,
            "numberOfEpisodes": 10,
            "seasons": 2
        },
        {
            "title": "Another Series",
            "description": "Description of Another Series",
            "image": "Another_Image_URL",
            "trailer": "Another_Trailer_URL",
            "added_date": "2023-11-21T10:30:00Z",
            "rating": 7.9,
            "numberOfEpisodes": 8,
            "seasons": 1
        },
        ...
    ]
    ```

#### Get Top-Rated Series

- **Endpoint:** GET /series/top-rated-series
- **Description:** Retrieve top-rated series.
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    [
        {
            "title": "Top Rated Series",
            "description": "Description of Top Rated Series",
            "image": "Top_Rated_Image_URL",
            "trailer": "Top_Rated_Trailer_URL",
            "added_date": "2023-11-20T15:45:00Z",
            "rating": 9.2,
            "numberOfEpisodes": 12,
            "seasons": 3
        },
        ...
    ]
    ```

#### Get Series with Pagination

- **Endpoint:** GET /series/serie-pages
- **Description:** Retrieve a paginated list of series.
- **Parameters:**
    - `page` (integer): The page number to retrieve (default is 1).
    - `perPage` (integer): Number of series per page (default is 10).
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    [
        {
            "title": "Series 1",
            "description": "Description of Series 1",
            "image": "Series1_Image_URL",
            "trailer": "Series1_Trailer_URL",
            "added_date": "2023-11-20T08:00:00Z",
            "rating": 7.1,
            "numberOfEpisodes": 15,
            "seasons": 4
        },
        ...
    ]
    ```

#### Search Series

- **Endpoint:** GET /series/search
- **Description:** Search series by title.
- **Parameters:**
    - `title` (string): Title of the series to search.
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    [
        {
            "title": "Search Result Series",
            "description": "Description of Search Result Series",
            "image": "Search_Result_Image_URL",
            "trailer": "Search_Result_Trailer_URL",
            "added_date": "2023-11-21T09:00:00Z",
            "rating": 8.0,
            "numberOfEpisodes": 20,
            "seasons": 5
        },
        ...
    ]
    ```

#### Get Series Details

- **Endpoint:** GET /series/{seriesId}
- **Description:** Retrieve details of a specific series by ID.
- **Parameters:**
    - `seriesId` (string): ID of the series to retrieve details.
- **Security:** Requires a valid authentication token.
- **Response:**
    ```json
    {
        "title": "Specific Series",
        "description": "Description of Specific Series",
        "image": "Specific_Series_Image_URL",
        "trailer": "Specific_Series_Trailer_URL",
        "added_date": "2023-11-20T14:20:00Z",
        "rating": 8.7,
        "numberOfEpisodes": 18,
        "seasons": 4
    }
    ```
