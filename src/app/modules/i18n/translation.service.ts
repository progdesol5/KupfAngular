import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  loadTranslations(): Observable<any> {
    const translationUrls = [
        '/assets/i18n/en.json',
        '/assets/i18n/ar.json'
    ];

    return new Observable(observer => {
      let translationData = {};

      translationUrls.forEach(translationUrl => {
        this.http.get(translationUrl).subscribe(
          data => {
            translationData = { ...translationData, ...data };
            if (Object.keys(translationData).length === translationUrls.length) {
              this.translate.setTranslation('en', translationData);
              this.translate.setTranslation('ar', translationData);
              observer.next(true);
              observer.complete();
            }
          },
          error => {
            console.error(error);
            observer.error(error);
          }
        );
      });
    });
  }
}