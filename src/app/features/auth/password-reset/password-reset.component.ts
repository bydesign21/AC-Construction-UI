import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  constructor(
    private auth: AuthService,
    private message: NzMessageService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  passwordResetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const { email, password, confirmPassword } =
      this.passwordResetForm.getRawValue();
    if (this.passwordResetForm.valid && email && password && confirmPassword) {
      this.auth
        .updatePassword(email, password)
        .pipe(take(1))
        .subscribe({
          next: async res => {
            this.message.success('Password successfully updated');
            await this.router.navigate(['auth', 'login'], { replaceUrl: true });
            this.cd.detectChanges();
          },
          error: err => this.message.error(err),
        });
    }
  }
}
