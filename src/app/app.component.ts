import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { forkJoin, of, Subscription } from 'rxjs';
import { AlbumsComponentInterface } from './interfaces/albums-component.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'test';

  public albumControl: FormControl = new FormControl(); // input control
  private _subscription: Subscription; // key input subscription
  public artist: string; // name of artist

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this._subscription = this.albumControl.valueChanges.pipe(
      debounceTime(1000), // debounce 1 sec
      distinctUntilChanged(), // search only if value changes
      filter((album: string) => {
        return album.length > 2; // search only if string contains more than 2 symbols
      }),
      switchMap((album: string) => {
        this.artist = album;
        return forkJoin(
          this.apiService.albumsInterfaces.map(
            (albumInterface: AlbumsComponentInterface) => {
              return albumInterface.apiFunction(this.artist, 1, albumInterface.subject);
            }));
      }),
      catchError((e) => {
          console.error(e);
          return of(e);
        }
      )).subscribe();
    this.albumControl.setValue('Madonna'); // start search string
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe(); // avoid memory leak
  }
}
