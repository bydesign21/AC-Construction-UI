import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageService } from '../language-service/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}

  transform(key: string): Observable<string | null> {
    return this.languageService.translate(key).pipe(
      map(translation => {
        return translation || null;
      })
    );
  }

  syncTransform(key: string): string | null {
    return this.languageService.syncTranslate(key);
  }
}
