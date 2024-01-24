import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translationCache: { [lang: string]: any } = {};
  languagePreference$ = new BehaviorSubject<string>(
    this.getLanguagePreferenceFromStorage()
  );

  constructor(private http: HttpClient) {}

  private getLangPref(): string {
    return this.languagePreference$.getValue();
  }

  private getLanguagePreferenceFromStorage(): string {
    return localStorage.getItem('langPref') || 'en-US';
  }

  getLanguagePreference(): Observable<string> {
    return this.languagePreference$.asObservable();
  }

  setLanguagePreference(langPref: string): void {
    localStorage.setItem('langPref', langPref);
    this.languagePreference$.next(langPref);
  }

  getTranslationFile(): Observable<any> {
    const langPref = this.getLangPref();
    if (this.translationCache[langPref]) {
      return of(this.translationCache[langPref]);
    }

    const translationFilePath = `assets/i18n/${langPref}.json`;
    return this.http.get<any>(translationFilePath).pipe(
      map(translation => {
        this.translationCache[langPref] = translation;
        return translation;
      }),
      catchError(error => {
        console.error('Error loading translation file:', error);
        return of({});
      })
    );
  }

  private getNestedTranslation(obj: any, path: string): string | null {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result[key]) {
        result = result[key];
      } else {
        result = null;
      }
    }
    return result;
  }

  translate(key: string): Observable<string | null> {
    return this.getTranslationFile().pipe(
      map(translations => this.getNestedTranslation(translations, key))
    );
  }

  syncTranslate(key: string): string | null {
    const langPref = this.getLangPref();
    const translations = this.translationCache[langPref];
    return this.getNestedTranslation(translations, key);
  }
}
