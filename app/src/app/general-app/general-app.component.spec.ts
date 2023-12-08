import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAppComponent } from './general-app.component';

describe('GeneralAppComponent', () => {
  let component: GeneralAppComponent;
  let fixture: ComponentFixture<GeneralAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
