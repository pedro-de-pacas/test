export interface DeezerApi<T> {
  data: T[];
  total: number;
  next: string;
  previous: string;
}
