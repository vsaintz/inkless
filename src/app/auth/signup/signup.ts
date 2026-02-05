import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { AuthService } from "@app/services/auth.service"
import { AuthBanner } from "@auth/components/auth-banner"

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, AuthBanner, RouterLink],
  templateUrl: './signup.html',
  styles: ``,
})

export class Signup {
  signupForm: FormGroup
  errorMessage: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  onSubmit() {
    this.errorMessage = ''
    if (this.signupForm.valid) {
      const payload = {
        first_name: this.signupForm.value.first_name,
        last_name: this.signupForm.value.last_name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      }

      this.authService.signup(payload).subscribe({
        next: ({ data, error }) => {
          if (error) {
            this.errorMessage = error.message
            return
          }
          console.log('Signup success: ', data)
          this.router.navigate(['/signin'])
        },
        error: (err) => {
          this.errorMessage = 'Something went wrong. Please check your connection.'
        }
      })
    } else {
      this.signupForm.markAllAsTouched()
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