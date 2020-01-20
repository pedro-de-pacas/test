import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlbumsComponentInterface } from '../../interfaces/albums-component.interface';

@Component({
  selector: 'app-list-of-albums',
  templateUrl: './list-of-albums.component.html',
  styleUrls: ['./list-of-albums.component.scss']
})
export class ListOfAlbumsComponent {

  @Input() inputInterface: AlbumsComponentInterface;
  @Input() artist: string;

  constructor(private apiService: ApiService) {
  }

  /**
   * Paginator event
   * Called when user selects page
   *
   * @param $event pagination event
   */
  pageChanged($event: { page: number }) {
    this.inputInterface.apiFunction(this.artist, $event.page, this.inputInterface.subject).subscribe(
      () => null,
      error => console.error(error)
    );
  }
}
