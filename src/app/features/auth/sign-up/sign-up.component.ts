import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BehaviorSubject, take } from 'rxjs';
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
  isLoading$ = new BehaviorSubject<boolean>(false);
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
    if (!this.signupForm.valid) {
      this.message.error('Please ensure all fields are correctly filled out.');
      this.highlightInvalidFields();
      return;
    }

    if (
      this.signupForm.controls.password.value !==
      this.signupForm.controls.confirmPassword.value
    ) {
      this.message.error('Passwords do not match.');
      return;
    }

    const { email, firstname, lastname, password } = this.signupForm.value;
    if (this.signupForm.valid && email && password && firstname && lastname) {
      this.handleSignUp(email, password, firstname, lastname);
    }
  }

  private highlightInvalidFields() {
    for (const key of Object.keys(
      this.signupForm.controls
    ) as (keyof typeof this.signupForm.controls)[]) {
      this.signupForm.controls[key].markAsTouched();
    }
    this.cd.detectChanges();
  }

  handleSignUp(
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ) {
    this.isLoading$.next(true);
    this.auth
      .signUp(email, password, firstname, lastname)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.signupForm.reset();
          this.router
            .navigate(['auth', 'login'], { replaceUrl: true })
            .then(() => {
              this.message.success('Successfully signed up');
              this.isLoading$.next(false);
              this.cd.detectChanges();
            });
        },
        error: err => {
          this.message.error(err);
        },
      });
  }

  handleLoginRedirect() {
    this.router
      .navigate(['auth', 'login'], { replaceUrl: true })
      .then(() => this.cd.detectChanges());
  }
}
