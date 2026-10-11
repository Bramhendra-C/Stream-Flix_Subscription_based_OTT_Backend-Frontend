package com.StreamFlixBackend.StreamFlix.repository;

import com.StreamFlixBackend.StreamFlix.model.Movie;
import com.StreamFlixBackend.StreamFlix.model.PlanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    Movie findByTitle(String title);

    List<Movie> findByGenre(String genre);

    List<Movie> findByLanguage(String language);

    List<Movie> findByDirector(String director);

    List<Movie> findByRequiredPlan(PlanType requiredPlan);

    List<Movie> findByGenreAndRequiredPlan(String genre, PlanType requiredPlan);
}