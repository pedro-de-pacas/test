import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAlbumsComponent } from './list-of-albums.component';

describe('ListOfAlbumsComponent', () => {
  let component: ListOfAlbumsComponent;
  let fixture: ComponentFixture<ListOfAlbumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfAlbumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
