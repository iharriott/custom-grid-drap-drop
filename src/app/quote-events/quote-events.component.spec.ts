import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteEventsComponent } from './quote-events.component';

describe('QuoteEventsComponent', () => {
  let component: QuoteEventsComponent;
  let fixture: ComponentFixture<QuoteEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
