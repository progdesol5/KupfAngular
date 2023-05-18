import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-engages',
  templateUrl: './engages.component.html',
  styleUrls: ['./engages.component.scss']
})
export class EngagesComponent implements OnInit {

  ifLanguageAlreadySelected: string | null;
  ifAlreadySelected: boolean;
  currentURL: string = '';
  constructor(private router: Router) { }

  // async reload(url: string): Promise<boolean> {
  //   await this.router.navigateByUrl('.', { skipLocationChange: true });
  //   return this.router.navigateByUrl(url);
  // }
  ngOnInit(): void {

  }
  // Set Language to AR
  switchToAr(language: string) {

    this.ifLanguageAlreadySelected = localStorage.getItem('lang');
    if (this.ifLanguageAlreadySelected != 'ar') {

      localStorage.setItem('lang', language);
      // Set Language value 
      localStorage.setItem('langType', '2');
      // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }



  }
  // Set Language to EN
  switchToEn(language: string) {
    this.ifLanguageAlreadySelected = localStorage.getItem('lang');
    if (this.ifLanguageAlreadySelected != 'en') {
      this.ifAlreadySelected = true;
      localStorage.setItem('lang', language);
      // Set Language value
      localStorage.setItem('langType', '1');
      // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);

    }
  }

}



