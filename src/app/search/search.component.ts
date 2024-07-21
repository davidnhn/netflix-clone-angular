import {Component, effect, inject, OnInit} from '@angular/core';
import {TmdbService} from "../service/tmdb.service";
import {ActivatedRoute} from "@angular/router";
import {Movie} from "../service/model/movie.model";
import { debounceTime, filter, map} from "rxjs";
import {MovieCardComponent} from "../home/movie-selector/movie-list/movie-card/movie-card.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MovieCardComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit{

  activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  tmdbService : TmdbService = inject(TmdbService);

  movies: Movie[] |undefined;

  constructor() {
    effect(() => {
      let moviesResponse = this.tmdbService.search().value;
      if(moviesResponse !== undefined) {
      this.movies = moviesResponse.results
      }
    });
  }

  ngOnInit(): void {
    this.onSearchTerm();
  }


  private onSearchTerm() {
    this.activatedRoute.queryParams.pipe(
      filter((queryParam: { [key: string]: any }) => queryParam['q']),
      debounceTime(300),
      map((queryParam: { [key: string]: any }) => queryParam['q']),
      ).subscribe({
      next: (term:string) => this.tmdbService.getMovieBySearchTerm(term)
    })
  }
}
