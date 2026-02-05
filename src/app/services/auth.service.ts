import { Injectable } from "@angular/core"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { from, Observable } from "rxjs"
import { environment } from "@environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  signup(payload: any): Observable<any> {
    const promise = this.supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          first_name: payload.first_name,
          last_name: payload.last_name,
        }
      }
    })
    return from(promise)
  }

  signin(payload: any): Observable<any> {
    const promise = this.supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    })
    return from(promise)
  }

  signInWithGoogle() {
    return from(this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:4200/dashboard'
      }
    }))
  }

  get session() {
    return this.supabase.auth.getSession()
  }
}
