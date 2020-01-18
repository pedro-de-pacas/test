import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './services/api-service/api.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'test';

  private albumControl: FormControl = new FormControl();
  private observable$: Subscription;
  private album: string;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.observable$ = this.albumControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      mergeMap((album: string) => {
        this.album = album;
        return forkJoin(
          [this.apiService.getAlbumsFromDeezer(album, 1),
            this.apiService.getAlbumsFromApple(album)]);
      })).subscribe();
  }

  ngOnDestroy(): void {
    this.observable$.unsubscribe();
  }

  getDeezerData(pageEvent: { page: number, itemsPerPage: number }) {
    this.apiService.getAlbumsFromDeezer(this.album, pageEvent.page).subscribe();
  }

  getAppleData() {
    this.apiService.getAlbumsFromApple(this.album).subscribe((data) => {
      console.log(data);
    });
  }
}
