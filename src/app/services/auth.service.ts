import { Injectable } from "@angular/core"
import { createClient, SupabaseClient, Session, User } from "@supabase/supabase-js"
import { BehaviorSubject, from, Observable } from "rxjs"
import { environment } from "@environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient
  private currentUser$ = new BehaviorSubject<User | null>(null)
  private currentSession$ = new BehaviorSubject<Session | null>(null)

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        }
      }
    )

    this.initializeAuthState()

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession$.next(session)
      this.currentUser$.next(session?.user ?? null)
    })
  }

  private async initializeAuthState() {
    const { data: { session } } = await this.supabase.auth.getSession()
    this.currentSession$.next(session)
    this.currentUser$.next(session?.user ?? null)
  }

  signup(payload: {
    email: string
    password: string
    first_name: string
    last_name: string
  }): Observable<any> {
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

  signin(payload: { email: string; password: string }): Observable<any> {
    const promise = this.supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    })
    return from(promise)
  }

  signout(): Observable<any> {
    return from(this.supabase.auth.signOut())
  }

  signInWithGoogle(): Observable<any> {
    return from(this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    }))
  }

  get session(): Promise<Session | null> {
    return this.supabase.auth.getSession().then(({ data }) => data.session)
  }

  get user$(): Observable<User | null> {
    return this.currentUser$.asObservable()
  }

  get isAuthenticated(): Promise<boolean> {
    return this.session.then(session => !!session)
  }

  getAccessToken(): Promise<string | null> {
    return this.session.then(session => session?.access_token ?? null)
  }

  async refreshSession(): Promise<void> {
    const { data, error } = await this.supabase.auth.refreshSession()
    if (error) {
      console.error('Failed to refresh session:', error)
      throw error
    }
    this.currentSession$.next(data.session)
    this.currentUser$.next(data.session?.user ?? null)
  }
}