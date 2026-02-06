import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "@services/auth.service"
import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http"
import { from, switchMap, catchError, throwError } from "rxjs"

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    if (!req.url.includes('/api/')) {
        return next(req)
    }

    return from(authService.getAccessToken()).pipe(
        switchMap(token => {
            if (token) {
                const cloned = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                })

                return next(cloned).pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 401 || error.status === 403) {
                            authService.signout().subscribe({
                                next: () => {
                                    router.navigate(['/signin'], {
                                        queryParams: {
                                            returnUrl: router.url,
                                            reason: 'session_expired'
                                        }
                                    })
                                },
                                error: (signoutError) => {
                                    console.error('Signout error:', signoutError)
                                    router.navigate(['/signin'])
                                }
                            })
                        }
                        return throwError(() => error)
                    })
                )
            }

            return next(req)
        })
    )
}