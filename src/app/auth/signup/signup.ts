import { Component } from "@angular/core"
import { AuthBanner } from "@auth/components/auth-banner/auth-banner"

@Component({
  selector: 'app-signup',
  imports: [AuthBanner],
  templateUrl: './signup.html',
  styles: ``,
})
export class Signup { }