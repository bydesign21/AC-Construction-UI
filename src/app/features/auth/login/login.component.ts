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
import { BehaviorSubject, take, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslatePipe } from '../../../shared-components/pipes/translate.pipe';

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
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AuthService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
    private translate: TranslatePipe
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const { email, password } = this.loginForm.value;
    if (this.loginForm.valid) {
      if (email && password) {
        this.isLoading$.next(true);
        this.auth
          .login(email, password)
          .pipe(take(1))
          .subscribe({
            next: res => {
              const { user, session } = res;
              sessionStorage.setItem('session', JSON.stringify(session));
              sessionStorage.setItem('isAuthenticated', 'true');
              const returnUrl =
                this.route.snapshot.queryParams['returnUrl'] || '/';
              this.router
                .navigate([decodeURIComponent(returnUrl)], {
                  replaceUrl: true,
                })
                .then(() => {
                  this.message.success(
                    `${
                      this.translate.syncTransform('AUTH.WELCOME') || 'Welcome'
                    }, ${
                      user?.user_metadata?.firstName
                        ? user.user_metadata.firstName
                        : 'User'
                    }`
                  );
                  this.cd.detectChanges();
                });
            },
            error: err => {
              console.error(err);
              this.message.error(err);
              this.isLoading$.next(false);
            },
            complete: () => {
              this.isLoading$.next(false);
              this.cd.detectChanges();
            },
          });
      }
    }
  }

  handleResetPasswordClicked() {
    this.modal.create({
      nzTitle:
        this.translate.syncTransform('AUTH.RESET_PASSWORD') || 'Reset Password',
      nzWidth: '45dvw',
      nzContent: this.passwordResetModalContent,
      nzClassName: 'relative',
      nzStyle: { top: '25dvh' },
      nzFooter: null,
    });
  }

  handlePasswordResetSubmit(email: string) {
    this.auth
      .resetPassword(email)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.modal.closeAll();
        },
        error: err => {
          this.message.error(err);
        },
      });
  }
}
