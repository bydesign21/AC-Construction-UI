import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  constructor(
    private auth: AuthService,
    private message: NzMessageService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (
      this.signupForm.valid &&
      this.signupForm.controls.password.value ===
        this.signupForm.controls.confirmPassword.value
    ) {
      const { email, firstname, lastname, password } = this.signupForm.value;
      if (email && firstname && lastname && password) {
        this.handleSignUp(email, password, firstname, lastname);
      } else {
        this.message.error('Please ensure all fields are completed');
      }
    }
  }

  handleSignUp(
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ) {
    this.auth
      .signUp(email, password, firstname, lastname)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.signupForm.reset();
          this.message.success('Successfully signed up');
        },
        error: err => {
          this.message.error(err);
        },
      });
  }

  async handleLoginRedirect() {
    await this.router.navigate(['auth', 'login'], { replaceUrl: true });
    this.cd.detectChanges();
  }
}
