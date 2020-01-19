export interface Album {
  cover: string;
  name: string;
  url: string;
}

export interface Albums {
  source: string;
  albums: Album[];
  total: number;
}
