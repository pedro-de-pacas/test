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

}
