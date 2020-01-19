import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DeezerAlbum } from '../interfaces/deezer/deezer-album.interface';
import { map } from 'rxjs/operators';
import { DeezerApi } from '../interfaces/deezer/deezer-api.interface';
import { ItunesApi } from '../interfaces/itunes/itunes-api.interface';
import { ItunesCollection } from '../interfaces/itunes/itunes-collection.interface';
import { Album, Albums } from '../interfaces/album.interface';
import { AlbumsComponentInterface } from '../interfaces/albums-component.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public albumsInterfaces: AlbumsComponentInterface[] = []; // main service interface
  public pageSize = 10; // size of one Albums page. Used for paginators

  /**
   * Empty Albums object fabric
   * Called from constuctor for this.albumsInterfaces initiation
   */
  private static _getEmptyAlbums(): Albums {
    return {
      source: null,
      albums: [],
      total: 0,
    };
  }

  constructor(private http: HttpClient) {
    /**
     * If we need additional album list, we simply need to add another object into this.albumsInterfaces
     */
    // deezer interface
    this.albumsInterfaces.push({
      subject: new BehaviorSubject(ApiService._getEmptyAlbums()),
      apiFunction: this._getAlbumsFromDeezer.bind(this),
    });
    // itunes interface
    this.albumsInterfaces.push({
      subject: new BehaviorSubject(ApiService._getEmptyAlbums()),
      apiFunction: this._getAlbumsFromApple.bind(this),
    });
  }

  /**
   * Gets data from deezer
   * Called from paginator and after every artist name changing
   *
   * @param artistName name of artist
   * @param page page to load
   * @param subject subject for template data updating
   */
  private _getAlbumsFromDeezer(artistName: string, page: number, subject: BehaviorSubject<Albums>): Observable<Albums> {
    const url =
      `https://api.deezer.com/search/album/?q=${artistName}&output=jsonp&limit=${this.pageSize}&index=${(page - 1) * this.pageSize}`;
    return this.http.jsonp<DeezerApi<DeezerAlbum>>(url, 'callback').pipe(
      map((rawAlbums: DeezerApi<DeezerAlbum>) => {
        const albums: Album[] = rawAlbums.data.map(
          (album: DeezerAlbum) => {
            return {
              cover: album.cover,
              url: album.link,
              name: album.title,
            };
          });
        const deezerData: Albums = {
          source: 'DEEZER',
          albums,
          total: rawAlbums.total
        };
        subject.next(deezerData); // fire update event
        return deezerData;
      }));
  }

  /**
   * Gets data from itunes
   * Called from paginator and after every artist name changing
   *
   * @param artistName name of artist
   * @param page page to load
   * @param subject subject for template data updating
   */
  private _getAlbumsFromApple(artistName: string, page: number, subject: BehaviorSubject<Albums>): Observable<Albums> {
    artistName = artistName.replace(' ', '+'); // avoid %20
    const params = { // GET params
      term: artistName,
      entity: 'album',
      media: 'music',
      country: 'us',
      attribute: 'artistTerm',
      offset: (this.pageSize * (page - 1)).toString(), // not sure if it works
      limit: this.pageSize.toString(10),
    };
    return this.http.get<ItunesApi<ItunesCollection>>(
      `https://itunes.apple.com/search`, {params}).pipe(
      map((rawAlbums: ItunesApi<ItunesCollection>) => {
        const albums: Album[] = rawAlbums.results.map(
          (album: ItunesCollection) => {
            return {
              cover: album.artworkUrl100,
              url: album.collectionViewUrl,
              name: album.collectionName
            };
          });
        const itunesData: Albums = {
          source: 'ITUNES',
          albums,
          total: rawAlbums.resultCount
        };
        subject.next(itunesData); // fire update event
        return itunesData;
      }));
  }
}
