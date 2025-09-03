import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePolizaComponent } from './detalle-poliza.component';

describe('DetallePolizaComponent', () => {
  let component: DetallePolizaComponent;
  let fixture: ComponentFixture<DetallePolizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePolizaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePolizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
