const apiKey = process.env.REACT_APP_API_KEY;
const baseUrl = process.env.REACT_APP_BASE_URL;



//  Search Movies
export const fetchMovies = async (query) => {
    try {
        const response = await fetch(
            `${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch searched movies");
        }

        const data = await response.json();
        return data.results;   //  return results
    } catch (error) {
        console.error(error);
        return []; // avoid crashing the app
    }
};

//  Popular Movies
export const getPopularMovies = async () => {
    try {
        const response = await fetch(
            `${baseUrl}/movie/popular?api_key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch popular movies");
        }

        const data = await response.json();
        return data.results;  
    } catch (error) {
        console.error(error);
        return []; // safe fallback
    }
};
