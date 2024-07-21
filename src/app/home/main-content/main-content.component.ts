import {Component, effect, OnInit} from '@angular/core';
import {TmdbService} from "../../service/tmdb.service";
import {Movie} from "../../service/model/movie.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit{

  tmdbService = new TmdbService();
  trendMovie: Movie | undefined;

  constructor() {
    effect(() => {
      const trendMovieResponse = this.tmdbService.trendMovies().value;
      if (trendMovieResponse) {
        this.trendMovie = trendMovieResponse.results[0];
      }
    });
  }

  ngOnInit(): void {
    this.fetchMovieTrends();
  }

  fetchMovieTrends():void {
    this.tmdbService.getTrends();
  }


}
