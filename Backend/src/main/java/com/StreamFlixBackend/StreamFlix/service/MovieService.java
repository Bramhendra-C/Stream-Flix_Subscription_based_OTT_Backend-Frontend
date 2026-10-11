package com.StreamFlixBackend.StreamFlix.service;

import com.StreamFlixBackend.StreamFlix.model.Movie;
import com.StreamFlixBackend.StreamFlix.model.PlanType;

import java.util.List;
import java.util.Optional;

public interface MovieService {

    Movie addMovie(Movie movie);

    List<Movie> getAllMovies();

    Optional<Movie> getMovieById(Long id);

    Movie getMovieByTitle(String title);

    List<Movie> getMoviesByGenre(String genre);

    List<Movie> getMoviesByPlan(PlanType planType);

    Movie updateMovie(Long id, Movie movie);

    void deleteMovie(Long id);
}