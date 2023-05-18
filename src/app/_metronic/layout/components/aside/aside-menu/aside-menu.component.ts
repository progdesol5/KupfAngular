import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuHeading } from 'src/app/modules/models/MenuHeading';
import { UserFunctionDto } from 'src/app/modules/models/UserFunctions/UserFunctionDto';
import { CommonService } from 'src/app/modules/_services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  @Output() dataEvent = new EventEmitter<string>();
  //
  menuHeading: any[] = [];
  color:any;
  lang:any;
  constructor(private common: CommonService, private router: Router) { 
    this.common.menuSessionUdpated.subscribe((result: any) => {
      this.setMenuFromSession();
    })
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang');
    this.setMenuFromSession();
    console.log('aside-menu', this.menuHeading); 
    
  }

  setMenuFromSession() {
    this.menuHeading = JSON.parse(localStorage.getItem('userMenu') || '{}');
  }

  openRequestForDiscountForm(title: string) {
    this.common.sendFormTitle(title);
    this.redirectTo('/service-setup/add-service');
  }

  // Manually redirect to URL to dynamicall change title of form
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  toPrint(val:string) {
    localStorage.setItem('LabelFrom', val);
  }
}
