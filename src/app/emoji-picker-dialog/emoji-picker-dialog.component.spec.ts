import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiPickerDialogComponent } from './emoji-picker-dialog.component';

describe('EmojiPickerDialogComponent', () => {
  let component: EmojiPickerDialogComponent;
  let fixture: ComponentFixture<EmojiPickerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmojiPickerDialogComponent]
    });
    fixture = TestBed.createComponent(EmojiPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
