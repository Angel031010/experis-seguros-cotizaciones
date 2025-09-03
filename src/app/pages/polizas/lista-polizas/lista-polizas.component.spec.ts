import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPolizasComponent } from './lista-polizas.component';

describe('ListaPolizasComponent', () => {
  let component: ListaPolizasComponent;
  let fixture: ComponentFixture<ListaPolizasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPolizasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPolizasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
