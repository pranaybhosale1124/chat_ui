import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Observer } from 'rxjs';

import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private apiUrl = 'http://localhost:3000';

  currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socket: Socket,
  ) { }

  setCurrentUser(user:any){
    this.currentUserSubject.next(user);
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/user/login`, { username, password })
  }

  isLoggedIn() {
    return sessionStorage.getItem('currentUserId') !== null;
  }

  register(currentUserId: any) {
    this.socket.emit('store_user', currentUserId);
  }

  getAllUsers(user_id:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/get-all-users/${user_id}`);
  }

  getUserById(id: any) {
    return this.http.get<any>(`${this.apiUrl}/user/get-user/${id}`);
  }

  getChat(meInput: any, userInput: any) {
    return this.http.post<any>(`${this.apiUrl}/chat/get-chat`, {
      me: meInput,
      user: userInput
    });
  }

  getMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }

  sendMessage(senderId: any, recipientId: any, message: string) {
    const data = { 'senderId': senderId, 'recipientId': recipientId, 'message': message };
    this.socket.emit('message', data);
  }

  saveMessage() {

  }

  loginByGoogle(userToken:any){
    // userToken
    const headers = new HttpHeaders({
      'Authorization': `${userToken}`
    });
    return this.http.get(`${this.apiUrl}/user/login-by-google`, {'headers':headers})
  }


  updateUser(user:any){
    return this.http.put<any>(`${this.apiUrl}/user/update-user/${user.user_id}`, user);
  }


}
