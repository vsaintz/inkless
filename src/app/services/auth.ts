import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:8000/api/auth'

  constructor(private http: HttpClient) { }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/`, userData)
  }

  signin(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jwt/create/`, credentials)
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token)
  }
}