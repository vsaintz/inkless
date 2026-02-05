import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { AuthService } from "@app/services/auth.service"
import { Router, RouterLink } from "@angular/router"
import { AuthBanner } from "@auth/components/auth-banner"

@Component({
  selector: 'app-signin',
  imports: [CommonModule, ReactiveFormsModule, AuthBanner, RouterLink],
  templateUrl: './signin.html',
  styles: ``,
})
export class Signin {

  signinForm: FormGroup
  errorMessage: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    this.errorMessage = ''

    if (this.signinForm.valid) {
      const payload = {
        email: this.signinForm.value.email,
        password: this.signinForm.value.password
      }

      this.authService.signin(payload).subscribe({
        next: ({ data, error }) => {
          if (error) {
            console.error('Login error: ', error.message)
            this.errorMessage = error.status === 400 || error.status === 401
              ? 'Invalid email or password'
              : error.message
            return
          }
          console.log('Login success:', data)
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          console.error('Connection error: ', err)
          this.errorMessage = 'Unable to connect to the server'
        }
      })
    } else {
      this.signinForm.markAllAsTouched()
      this.errorMessage = 'Please fill in all required fields'
    }
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle().subscribe({
      error: (err) => {
        this.errorMessage = 'Could not connect to Google'
      }
    })
  }
}
