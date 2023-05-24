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
    document.getElementsByTagName('body')[0].removeAttribute('dir');
    document.getElementsByTagName('body')[0].removeAttribute('direction');
    document.getElementsByTagName('body')[0].removeAttribute('style');
    this.ifLanguageAlreadySelected = localStorage.getItem('lang');
    if (this.ifLanguageAlreadySelected != 'ar') {
      localStorage.setItem('lang', language);
      // Set Language value 
      localStorage.setItem('langType', '2');
      document.getElementsByTagName('body')[0].setAttribute('dir', 'rtl');
      document.getElementsByTagName('body')[0].setAttribute('direction', 'rtl');
      document.getElementsByTagName('body')[0].setAttribute('style', 'direction: rtl');
      // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }
  }
  // Set Language to EN
  switchToEn(language: string) {
    document.getElementsByTagName('body')[0].removeAttribute('dir');
    document.getElementsByTagName('body')[0].removeAttribute('direction');
    document.getElementsByTagName('body')[0].removeAttribute('style');
    this.ifLanguageAlreadySelected = localStorage.getItem('lang');
    if (this.ifLanguageAlreadySelected != 'en') {
      this.ifAlreadySelected = true;
      localStorage.setItem('lang', language);
      // Set Language value
      localStorage.setItem('langType', '1');
      document.getElementsByTagName('body')[0].setAttribute('dir', 'ltr');
      document.getElementsByTagName('body')[0].setAttribute('direction', 'ltr');
      document.getElementsByTagName('body')[0].setAttribute('style', 'direction: ltr');
      // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }
  }

  switchLanguage(language: string) {
    if (language == 'en') {
      document.getElementsByTagName('body')[0].removeAttribute('dir');
      document.getElementsByTagName('body')[0].removeAttribute('direction');
      document.getElementsByTagName('body')[0].removeAttribute('style');
      this.ifLanguageAlreadySelected = localStorage.getItem('lang');
      if (this.ifLanguageAlreadySelected != 'en') {
        this.ifAlreadySelected = true;
        localStorage.setItem('lang', language);
        // Set Language value
        localStorage.setItem('langType', '1');
        document.getElementsByTagName('body')[0].setAttribute('dir', 'ltr');
        document.getElementsByTagName('body')[0].setAttribute('direction', 'ltr');
        document.getElementsByTagName('body')[0].setAttribute('style', 'direction: ltr');
        // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
      }else{
        localStorage.setItem('lang', language);
        // Set Language value
        localStorage.setItem('langType', '1');
        document.getElementsByTagName('body')[0].setAttribute('dir', 'ltr');
        document.getElementsByTagName('body')[0].setAttribute('direction', 'ltr');
        document.getElementsByTagName('body')[0].setAttribute('style', 'direction: ltr');
        // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
      }
    }
    if (language == 'ar') {
      document.getElementsByTagName('body')[0].removeAttribute('dir');
      document.getElementsByTagName('body')[0].removeAttribute('direction');
      document.getElementsByTagName('body')[0].removeAttribute('style');
      this.ifLanguageAlreadySelected = localStorage.getItem('lang');
      if (this.ifLanguageAlreadySelected != 'ar') {
        localStorage.setItem('lang', language);
        // Set Language value 
        localStorage.setItem('langType', '2');
        document.getElementsByTagName('body')[0].setAttribute('dir', 'rtl');
        document.getElementsByTagName('body')[0].setAttribute('direction', 'rtl');
        document.getElementsByTagName('body')[0].setAttribute('style', 'direction: rtl');
        // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
      } else{
        localStorage.setItem('lang', language);
        // Set Language value 
        localStorage.setItem('langType', '2');
        document.getElementsByTagName('body')[0].setAttribute('dir', 'rtl');
        document.getElementsByTagName('body')[0].setAttribute('direction', 'rtl');
        document.getElementsByTagName('body')[0].setAttribute('style', 'direction: rtl');
        // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
      }
    }
  }

}



