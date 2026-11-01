import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, movies.length]);

  const handleSearch = (searchQuery: string): void => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      toast.error("Please enter a movie name.");
      return;
    }

    setQuery(trimmedQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = (): void => {
    setSelectedMovie(null);
  };

  const handlePageChange = (selectedPage: number): void => {
    setPage(selectedPage + 1);
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      <main className={css.app}>
        {isPending && query !== "" ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          <>
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => handlePageChange(selected)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}

            {movies.length > 0 && (
              <MovieGrid movies={movies} onSelect={handleSelectMovie} />
            )}
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      <Toaster position="top-right" />
    </>
  );
}
