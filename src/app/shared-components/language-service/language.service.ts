import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translationCache: { [lang: string]: any } = {};

  constructor(private http: HttpClient) { }

  getLanguagePreference(): string {
    return localStorage.getItem('langPref') || 'en-US';
  }

  setLanguagePreference(langPref: string): void {
    localStorage.setItem('langPref', langPref);
  }

  getTranslationFile(): Observable<any> {
    const langPref = this.getLanguagePreference();
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

  private getNestedTranslation(obj: any, path: string): string {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result[key]) {
        result = result[key];
      } else {
        throw new Error(`Translation not found for path: ${path} in ${key}`);
      }
    }
    return result;
  }

  translate(key: string): Observable<string> {
    return this.getTranslationFile().pipe(
      map(translations => this.getNestedTranslation(translations, key) || key)
    );
  }
}
