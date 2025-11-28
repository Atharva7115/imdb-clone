const apiKey = process.env.REACT_APP_API_KEY;
const baseUrl = process.env.REACT_APP_BASE_URL;

//  Search Movies (with pagination)
export const fetchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch searched movies");
    }

    const data = await response.json();

    //  Return both results and totalPages
    return {
      results: data.results || [],
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error(error);
    return { results: [], totalPages: 1 }; // avoid crashing the app
  }
};

//  Popular Movies (with pagination)
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${baseUrl}/movie/popular?api_key=${apiKey}&page=${page}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular movies");
    }

    const data = await response.json();

    // ⬅️ Return both results and totalPages
    return {
      results: data.results || [],
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error(error);
    return { results: [], totalPages: 1 }; // safe fallback
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(
      `${baseUrl}/movie/${id}?api_key=${apiKey}&append_to_response=credits`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return await response.json();
  } catch (error) {
    console.error("Movie details error:", error);
    return null;
  }
};