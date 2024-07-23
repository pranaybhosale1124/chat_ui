// src/app/services/sound.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlaySoundService {
  private notificationAudio = new Audio();
  private sentAudio = new Audio();

  constructor() {
    this.notificationAudio.src = 'assets/audios/message-alert.mp3';
    this.sentAudio.src='assets/audios/sent-alert.mp3'
    this.notificationAudio.load();
    this.sentAudio.load();
  }

  playNotificationSound() {
    this.notificationAudio.play().catch(error => console.log('Error playing sound:', error));
  }

  playSentSound() {
    this.sentAudio.play().catch(error => console.log('Error playing sound:', error));
  }
}
