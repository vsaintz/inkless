import { Routes } from "@angular/router"
import { authGuard } from "@guards/auth.guard"
import { guestGuard } from "@guards/guest.guard"
import { Signin } from "@auth/signin/signin"
import { Signup } from "@auth/signup/signup"
import { Dashboard } from "@dashboard/dashboard"

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/signin',
        pathMatch: 'full'
    },
    {
        path: 'signin',
        canActivate: [guestGuard],
        component: Signin
    },
    {
        path: 'signup',
        canActivate: [guestGuard],
        component: Signup
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        component: Dashboard
    },
    {
        path: '**',
        redirectTo: '/signin'
    }
]
