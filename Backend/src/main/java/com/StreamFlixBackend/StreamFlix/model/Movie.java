package com.StreamFlixBackend.StreamFlix.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String genre;

    private String director;

    private String hero;

    private String heroine;

    private Integer releaseYear;

    private Double rating;

    private String language;

    private Integer duration;

    private String thumbnailUrl;

    private String bannerUrl;

    private String trailerUrl;

    private String videoUrl;

    @Enumerated(EnumType.STRING)
    private PlanType requiredPlan;
}