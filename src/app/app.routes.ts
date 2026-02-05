import { Routes } from "@angular/router"
import { Signin } from "@auth/signin/signin"
import { Signup } from "@auth/signup/signup"
import { Dashboard } from "@dashboard/dashboard"


export const routes: Routes = [

    { path: '', redirectTo: 'signin', pathMatch: 'full' },

    { path: 'signin', component: Signin },
    { path: 'signup', component: Signup },

    { path: 'dashboard', component: Dashboard },
];
