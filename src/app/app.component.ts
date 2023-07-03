import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
// language list
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from './modules/i18n';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  
  
  constructor(private translateService: TranslateService, private translationService: TranslationService) {
   
  }

  ngOnInit() {
    this.translationService.loadTranslations().subscribe(
      result => {
        console.log('Translations loaded');
        // You can perform additional actions after translations are loaded if needed
      },
      error => {
        console.error('Error loading translations:', error);
      }
    );
  } 
}
