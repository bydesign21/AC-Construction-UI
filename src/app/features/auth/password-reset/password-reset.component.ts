import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { switchMap, take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../shared-components/pipes/translate.pipe';

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
    private cd: ChangeDetectorRef,
    private translate: TranslatePipe
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
          next: () => {
            this.message.success(
              this.translate.syncTransform('AUTH.PASSWORD_UPDATE_SUCCESS') ||
                'Password successfully updated'
            );
            this.router
              .navigate(['auth', 'login'], { replaceUrl: true })
              .then(() => this.cd.detectChanges());
          },
          error: err => this.message.error(err),
        });
    }
  }
}
