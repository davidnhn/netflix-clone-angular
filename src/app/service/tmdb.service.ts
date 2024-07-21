import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Movie, MovieApiResponse} from "./model/movie.model";
import {State} from "./model/state.model";
import {environment} from "../../environments/environment";
import {GenresResponse} from "./model/genre.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MoreInfosComponent} from "../home/more-infos/more-infos.component";

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  http: HttpClient = inject(HttpClient);

  modalService = inject(NgbModal);

  baseUrl: string =" https://api.themoviedb.org";

  private trendMovies$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>> =
    signal(State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build());

  trendMovies = computed(() => this.trendMovies$());


  private allGenres$: WritableSignal<State<GenresResponse, HttpErrorResponse>> =
    signal(State.Builder<GenresResponse, HttpErrorResponse>().forInit().build());

  allGenres = computed(() => this.allGenres$());


  private moviesByGenre$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>> =
    signal(State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build());

  moviesByGenre = computed(() => this.moviesByGenre$());



  private movieById$: WritableSignal<State<Movie, HttpErrorResponse>> =
    signal(State.Builder<Movie, HttpErrorResponse>().forInit().build());

  movieById = computed(() => this.movieById$());


  private search$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>> =
    signal(State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build());

  search = computed(() => this.search$());


  getTrends() : void {
    this.http.get<MovieApiResponse>(`${this.baseUrl}/3/trending/all/day`, {headers: this.getHeaders()})
      .subscribe({
        next: tmdbResponse =>
          this.trendMovies$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forSuccess(tmdbResponse).build()),
        error: err =>
          this.trendMovies$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forError(err).build())

      })

  }
    getHeaders(): HttpHeaders {
      return new HttpHeaders().set('Authorization', `Bearer ${environment.TMDB_API_KEY}`);

    }
  getAllGenres() : void {
    this.http.get<GenresResponse>(`${this.baseUrl}/3/genre/movie/list`, {headers: this.getHeaders()})
      .subscribe({
        next: genresResponse =>
          this.allGenres$
            .set(State.Builder<GenresResponse, HttpErrorResponse>()
              .forSuccess(genresResponse).build()),
        error: err =>
          this.allGenres$
            .set(State.Builder<GenresResponse, HttpErrorResponse>()
              .forError(err).build())

      })
  }

  getImageUrl(id: string, size: 'original' | 'w500' | 'w200'): string {
    return `https://image.tmdb.org/t/p/${size}/${id}`;
  }

  getMoviesByGenre(genreId: number):void {

    let queryParams = new HttpParams();
    queryParams = queryParams.set("language", "en-US");
    queryParams = queryParams.set("with_genres", genreId);
    this.http.get<MovieApiResponse>(`${this.baseUrl}/3/discover/movie`, {headers: this.getHeaders(), params: queryParams})
      .subscribe({
        next: moviesByGenreResponse => {
          moviesByGenreResponse.genreId = genreId;
          this.moviesByGenre$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forSuccess(moviesByGenreResponse).build());
        },
        error: err =>
          this.moviesByGenre$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forError(err).build())

      })

  }

  getMovieById(movieId: number):void {

    this.http.get<Movie>(`${this.baseUrl}/3/movie/${movieId}`, {headers: this.getHeaders()})
      .subscribe({
        next: movieByIdResponse => {
          this.movieById$
            .set(State.Builder<Movie, HttpErrorResponse>()
              .forSuccess(movieByIdResponse).build());
        },
        error: err =>
          this.movieById$
            .set(State.Builder<Movie, HttpErrorResponse>()
              .forError(err).build())

      })

  }

  getMovieBySearchTerm(searchTerm: string):void {
    let queryParam = new HttpParams();
    queryParam = queryParam.set("language", "en-US");
    queryParam = queryParam.set("query", searchTerm);
    this.http.get<MovieApiResponse>(`${this.baseUrl}/3/search/movie`, {headers: this.getHeaders(), params: queryParam})
      .subscribe({
        next: moviesBySearchTerm => {
          this.search$.set(
            State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forSuccess(moviesBySearchTerm)
              .build());
        },
        error: err => {
          this.search$
          .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
          .forError(err)
            .build());
        }
      })
  }

  constructor() { }

  clearMovieById() {
    this.movieById$.set(State.Builder<Movie, HttpErrorResponse>().forInit().build());
  }

  openMoreInfos(movieId: number) {
    let moreInfosModal = this.modalService.open(MoreInfosComponent, {});
    moreInfosModal.componentInstance.movieId = movieId;
  }
}
