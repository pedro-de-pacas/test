import { Component } from '@angular/core';
import { ApiService } from './services/api-service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test';

  constructor(private apiService: ApiService) {
  }

  getData() {
    this.apiService.getAlbumsFromDeezer('eminem').subscribe((data) => {
      console.log(data);
    });
  }
}
