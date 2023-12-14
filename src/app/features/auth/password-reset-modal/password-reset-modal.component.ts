import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset-modal',
  standalone: false,
  templateUrl: './password-reset-modal.component.html',
  styleUrl: './password-reset-modal.component.scss',
})
export class PasswordResetModalComponent implements OnInit {
  @Output() passwordReset: EventEmitter<any> = new EventEmitter<any>();
  @Input() email: string | null = null;
  resetForm: FormGroup<any> = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit(): void {
    this.resetForm.setValue({ email: this.email });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.passwordReset.emit(this.resetForm?.get('email')?.value);
    }
  }
}
