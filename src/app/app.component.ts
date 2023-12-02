import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private i18n: NzI18nService) {}
  title = 'AC-Construction-UI';

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
  }
}
