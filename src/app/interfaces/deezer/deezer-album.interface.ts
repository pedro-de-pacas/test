import { DeezerArtist } from './deezer-artist.interface';

export interface DeezerAlbum {
  id: number;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  genre_id: 113;
  nb_tracks: 14;
  record_type: string;
  tracklist: string;
  artist: DeezerArtist;
  explicit_lyrics: boolean;
  type: string;
}
