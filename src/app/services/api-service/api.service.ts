import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DeezerAlbum } from '../../interfaces/deezer-album.interface';
import { map, tap } from 'rxjs/operators';
import { DeezerApi } from '../../interfaces/deezer-api.interface';
import { ItunesApi } from '../../interfaces/itunes-api.interface';
import { ItunesCollection } from '../../interfaces/itunes-collection.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _deezerSubject = new BehaviorSubject<DeezerApi<DeezerAlbum>>(null);
  public deezerAlbums$ = this._deezerSubject.asObservable();

  private _itunesAlbums: ItunesCollection[] = [];


  public get itunesAlbums(): ItunesCollection[] {
    return this._itunesAlbums;
  }

  constructor(private http: HttpClient) {
  }

  getAlbumsFromDeezer(artistName: string, page: number): Observable<DeezerApi<DeezerAlbum>> {
    return this.http.jsonp<DeezerApi<DeezerAlbum>>(
      `https://api.deezer.com/search/album/?q=${artistName}&output=jsonp&limit=25&index=${(page - 1) * 25}`,
      'callback').pipe(
      tap(
        (albums: DeezerApi<DeezerAlbum>) => {
          this._deezerSubject.next(albums);
        }));
  }

  getAlbumsFromApple(artistName: string): Observable<ItunesCollection[]> {
    artistName = artistName.replace(' ', '+');
    const params = {
      term: artistName,
      entity: 'album',
      media: 'music',
      country: 'us',
      attribute: 'artistTerm',
    };
    return this.http.get<ItunesApi<ItunesCollection>>(
      `https://itunes.apple.com/search`, {params}).pipe(
      map(
        (albums: ItunesApi<ItunesCollection>) => {
          this._itunesAlbums = albums.results;
          console.log(albums.results);
          return albums.results;
        }));
  }
}
