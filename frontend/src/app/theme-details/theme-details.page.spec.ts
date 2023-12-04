import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeDetailsPage } from './theme-details.page';

describe('ThemeDetailsPage', () => {
  let component: ThemeDetailsPage;
  let fixture: ComponentFixture<ThemeDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ThemeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
