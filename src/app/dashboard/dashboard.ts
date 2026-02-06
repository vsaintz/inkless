import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "@services/auth.service"

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styles: ``,
})
export class Dashboard {

  constructor(private authService: AuthService, private router: Router) { }

  handleSignOut() {
    this.authService.signout().subscribe({
      next: () => {
        this.router.navigate(['/signin'])
      },
      error: (err) => {
        console.error('Error signiing out: ', err)
      }
    })
  }
}
