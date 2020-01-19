import { BehaviorSubject, Observable } from 'rxjs';
import { Albums } from './album.interface';

/**
 * Api-Service output interface
 */
export interface AlbumsComponentInterface {
  subject: BehaviorSubject<Albums>;
  apiFunction: ApiFunction;
}

/**
 * Api-Service api functions type
 */
export type ApiFunction = (albumName: string, page: number, subject: BehaviorSubject<Albums>) => Observable<Albums>;
