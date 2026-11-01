import axios from "axios";
import type { MovieResponse } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

export async function fetchMovies(
  query: string,
  page: number = 1,
): Promise<MovieResponse> {
  if (!token) {
    throw new Error("TMDB token is missing.");
  }

  const response = await axios.get<MovieResponse>(BASE_URL, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
