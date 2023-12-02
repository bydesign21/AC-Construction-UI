import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChild('passwordResetModalContent', { static: false })
  passwordResetModalContent!: TemplateRef<any>;

  constructor(
    private auth: AuthService,
    private message: NzMessageService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private modal: NzModalService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const { email, password } = this.loginForm.value;
    if (this.loginForm.valid) {
      if (email && password) {
        this.auth
          .login(email, password)
          .pipe(take(1))
          .subscribe({
            next: async res => {
              console.log('res', res);
              const { user, session } = res;
              sessionStorage.setItem('session', JSON.stringify(session));
              sessionStorage.setItem('isAuthenticated', 'true');
              await this.router.navigate([''], { replaceUrl: true });
              this.message.success(
                `Welcome,  ${
                  user?.user_metadata?.firstName
                    ? user.user_metadata.firstName
                    : 'User'
                }`
              );
              this.cd.detectChanges();
            },
            error: err => {
              console.error(err);
              this.message.error(err);
            },
          });
      }
    }
  }

  handleResetPasswordClicked() {
    this.modal.create({
      nzTitle: 'Reset Password',
      nzWidth: '45dvw',
      nzContent: this.passwordResetModalContent,
      nzClassName: 'relative',
      nzStyle: { top: '25dvh' },
      nzFooter: null,
    });
  }

  handlePasswordResetSubmit(email: string) {
    console.log('password reset fn triggered');
    this.auth
      .resetPassword(email)
      .pipe(take(1))
      .subscribe({
        next: res => {
          console.log('passwordResetTriggered', res);
          this.modal.closeAll();
        },
        error: err => {
          this.message.error(err);
        },
      });
  }
}
