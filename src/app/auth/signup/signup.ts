import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router, RouterLink } from "@angular/router"
import { AuthService } from "@services/auth"
import { AuthBanner } from "@auth/components/auth-banner/auth-banner"

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
        username: this.signupForm.value.email,
        email: this.signupForm.value.email,
        first_name: this.signupForm.value.first_name,
        last_name: this.signupForm.value.last_name,
        password: this.signupForm.value.password,
      }
      this.authService.signup(payload).subscribe({
        next: (res) => {
          console.log('Signup success: ', res)
          this.router.navigate(['/signin'])
        },
        error: (err) => {
          console.error('Signup error: ', err)
          if (err.status === 400 && err.error) {

            const errorKeys = Object.keys(err.error)

            if (errorKeys.length > 0) {
              const firstKey = errorKeys[0]
              const firstError = err.error[firstKey]

              const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError

              if (firstKey == 'username') {
                this.errorMessage = 'This email is already registered. Please log in'
              } else if (firstKey === 'password' && errorMessage.includes('similar to the username')) {
                this.errorMessage = 'The password is too similar to your email address'
              } else {
                this.errorMessage = errorMessage
              }
            } else {
              this.errorMessage = 'Invalid data provided'
            }
          } else {
            this.errorMessage = 'Something went wrong. Please try again'
          }
        }
      })
    } else {
      this.signupForm.markAllAsTouched()
      this.errorMessage = 'Please fill in all required fields'
    }
  }
}