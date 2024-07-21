import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {TmdbService} from "../../service/tmdb.service";
import {Movie} from "../../service/model/movie.model";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-more-infos',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './more-infos.component.html',
  styleUrl: './more-infos.component.scss'
})
export class MoreInfosComponent implements OnInit, OnDestroy{

  public movieId: number = -1;

  tmdbService: TmdbService = inject(TmdbService);
  modalService = inject(NgbModal);

  movie : Movie | undefined;

  constructor() {
    effect(() => {
      this.movie =  this.tmdbService.movieById().value as Movie;
    });
  }

  getMovieById(id: number) {
    this.tmdbService.getMovieById(id);
  }

  ngOnInit(): void {
    this.getMovieById(this.movieId);
  }

  ngOnDestroy(): void {
    // effacer le contenu du signal quand la popup se ferme pour éviter que les infos du film sur lequel on a cliqué précédemment s'affiche
    this.tmdbService.clearMovieById();
  }



}
