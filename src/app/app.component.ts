import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzI18nService, en_US, es_ES } from 'ng-zorro-antd/i18n';
import { LanguageService } from './shared-components/language-service/language.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [LanguageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private i18n: NzI18nService,
    private language: LanguageService
  ) { }
  title = 'AC-Construction-UI';
  destroy$ = new Subject();

  ngOnInit(): void {
    this.language
      .getLanguagePreference()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        console.log('lang', lang);
        this.setLanguage(lang);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  setLanguage(lang: string): void {
    switch (lang) {
      case 'en-US':
        this.i18n.setLocale(en_US);
        break;
      case 'es-MX':
        this.i18n.setLocale(es_ES);
        break;
      default:
        this.i18n.setLocale(en_US);
        break;
    }
  }
}
