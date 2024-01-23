import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserAttributes } from '@supabase/supabase-js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-profile-card',
  standalone: false,
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent implements OnInit {
  @Input() user: User = {} as User;
  @Output() save = new EventEmitter<UserAttributes>();
  editMode = false;
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('this.user', this.user);
    this.userForm = this.fb.group({
      firstName: [
        { value: this.user.user_metadata.firstName },
        [Validators.required, Validators.minLength(1)],
      ],
      lastName: [
        { value: this.user.user_metadata.lastName },
        [Validators.required, Validators.minLength(1)],
      ],
      email: [
        { value: this.user.email },
        [Validators.required, Validators.email, Validators.minLength(1)],
      ],
      langPref: [
        {
          value: this.user.user_metadata.langPref || 'en-US',
          disabled: !this.editMode,
        },
        [Validators.required],
      ],
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.userForm.enable();
      this.userForm.reset({
        firstName: this.user.user_metadata.firstName,
        lastName: this.user.user_metadata.lastName,
        email: this.user.email,
        langPref: this.user.user_metadata.langPref || 'en-US',
      });
    } else {
      this.userForm.disable();
    }
  }

  onSaveChanges(): void {
    if (this.userForm.valid) {
      const user: UserAttributes = {
        data: {
          firstName: this.userForm.get('firstName')?.value,
          lastName: this.userForm.get('lastName')?.value,
          langPref: this.userForm.get('langPref')?.value,
        },
        email: this.userForm.get('email')?.value,
      };
      this.save.emit(user);
      this.toggleEditMode();
    }
  }

  handleLanguageChange(event: string) {
    this.userForm.patchValue({ langPref: event });
  }
}
