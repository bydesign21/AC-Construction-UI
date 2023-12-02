import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-app-container',
  standalone: false,
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.scss',
})
export class AppContainerComponent {}
