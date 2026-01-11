import { Component } from "@angular/core"
import { AuthBanner } from "@auth/components/auth-banner/auth-banner"

@Component({
  selector: 'app-signin',
  imports: [AuthBanner],
  templateUrl: './signin.html',
  styles: ``,
})
export class Signin { }
