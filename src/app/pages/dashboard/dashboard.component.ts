import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { LocalizationService } from 'src/app/modules/_services/localization.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  /*********************/
  AppFormLabels$: Observable<FormTitleHd[]>;
  AppFormLabels: FormTitleHd[] = [];
  lang: any;
  /*********************/
  menuHeading: any[]=[];
  
  constructor(private localizationService: LocalizationService) { }

  ngOnInit(): void {
    //Set default lanauge to en (English) If not exists
    if (localStorage.getItem("lang") === null) {
      localStorage.setItem('lang', 'en');
      localStorage.setItem('langType', '1');
    }
    // 
    if (localStorage.getItem('AppLabels') === null) {
      this.lang = localStorage.getItem('lang');
      // Get form body labels 
      this.AppFormLabels$ = this.localizationService.getAppLabels()
      // Get observable as normal array of items
      this.AppFormLabels$.subscribe({
        next: data => {
          this.AppFormLabels = data;
          localStorage.setItem('AppLabels', JSON.stringify(this.AppFormLabels));
        },
        error: error => {
          console.log(error);
        },
        complete: () => {
          console.log('Request completed');
        }
      })
    }
    
    //
    // this.menuHeading= JSON.parse(localStorage.getItem('userMenu')!);
    // console.log('dasboard',this.menuHeading);
   }

}

