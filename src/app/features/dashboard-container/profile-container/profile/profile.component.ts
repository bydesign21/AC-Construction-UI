import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../profile-services/profile.service';
import { User, UserAttributes } from '@supabase/supabase-js';
import { switchMap, take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PasswordResetModalComponent } from '../../../auth/password-reset-modal/password-reset-modal.component';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  constructor(
    private profile: ProfileService,
    private cd: ChangeDetectorRef,
    private message: NzMessageService,
    private router: Router,
    private auth: AuthService,
    private modal: NzModalService
  ) { }
  userProfile: User | null = null;

  handleUpdateProfile(newProfile: UserAttributes) {
    this.profile
      .updateProfile(newProfile)
      .pipe(take(1))
      .subscribe({
        next: res => {
          console.log('res', res);
          this.userProfile = res;
          this.updateSessionStorage(res);
          localStorage.setItem('langPref', res.user_metadata.langPref);
          this.message.success('Profile updated successfully');
        },
        error: err => {
          this.message.error(err.message);
        },
        complete: () => {
          this.cd.detectChanges();
        },
      });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  updateSessionStorage(user: User) {
    const session = JSON.parse(sessionStorage.getItem('session') || '');
    session.user = user;
    sessionStorage.setItem('session', JSON.stringify(session));
  }

  getSessionUser(): User {
    const session = JSON.parse(sessionStorage.getItem('session') || '');
    return session?.user;
  }

  loadProfile() {
    const user = this.getSessionUser();
    if (!user) {
      this.profile
        .getProfile()
        .pipe(take(1))
        .subscribe({
          next: res => {
            this.userProfile = res;
          },
          error: err => {
            this.message.error(err.message);
          },
          complete: () => {
            this.cd.detectChanges();
          },
        });
    } else {
      this.userProfile = user;
    }
  }

  handleResetPasswordClicked() {
    const modal = this.modal.create({
      nzTitle: 'Reset Password',
      nzContent: PasswordResetModalComponent,
      nzWidth: 450,
      nzFooter: null,
    });

    modal.componentInstance?.passwordReset
      .pipe(
        take(1),
        switchMap(email => this.auth.resetPassword(email))
      )
      .subscribe({
        next: () => {
          this.message.success('Password reset email sent');
          modal.close();
        },
        error: err => {
          this.message.error(err.message);
        },
        complete: () => {
          this.cd.detectChanges();
        },
      });
  }

  handleDeleteAccountClicked() {
    if (!this.userProfile) {
      return;
    }
    this.profile
      .deleteAccount(this.userProfile?.id)
      .pipe(
        take(1),
        switchMap(() => {
          return this.auth.signOut();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['auth', 'login']).then(() => {
            this.message.success('Account deleted successfully');
          });
        },
        error: err => {
          this.message.error(err.message);
        },
        complete: () => {
          this.cd.detectChanges();
        },
      });
  }
}
