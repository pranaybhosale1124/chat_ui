import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultChatComponent } from './default-chat.component';

describe('DefaultChatComponent', () => {
  let component: DefaultChatComponent;
  let fixture: ComponentFixture<DefaultChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultChatComponent]
    });
    fixture = TestBed.createComponent(DefaultChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
