import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { ReturnServiceApprovals } from 'src/app/modules/models/ReturnServiceApprovals';
import { FinancialService } from 'src/app/modules/_services/financial.service';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit {


  //#region 
  /*----------------------------------------------------*/

  // Language Type e.g. 1 = ENGLISH and 2 =  ARABIC
  languageType: any;

  // Selected Language
  language: any;

  // We will get form lables from lcale storage and will put into array.
  AppFormLabels: FormTitleHd[] = [];

  // We will filter form header labels array
  formHeaderLabels: any[] = [];

  // We will filter form body labels array
  formBodyLabels: any[] = [];

  // FormId
  formId: string;

  /*----------------------------------------------------*/
  //#endregion
 
  //#region
  // To display table column headers
  columnsToDisplay: string[] = ['action', 'employeeName', 'services', 'installments', 'amount','dated','paid','payDate','discounted'];

  // Getting data as abservable.
  returnServiceApprovals$: Observable<ReturnServiceApprovals[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  returnServiceApprovals: MatTableDataSource<ReturnServiceApprovals> = new MatTableDataSource<any>([]);

  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Sorting
  @ViewChild(MatSort) sort!: MatSort;

  // Hide footer while loading.
  isLoadingCompleted: boolean = false;

  // Incase of any error will display error message.
  dataLoadingStatus: string = '';

  // True of any error
  isError: boolean = false;

  // formGroup
  formGroup: FormGroup;

  // Search Term
  searchTerm: string = '';
  //#endregion
  

  formTitle: string;
  selectedOpt: string = '';
  lang: any = '';
  // Modal close result...
  closeResult = '';
  constructor(private router: Router,
              private financialService: FinancialService) {
      this.formGroup = new FormGroup({
        searchTerm: new FormControl(null)
      })
     }

  ngOnInit(): void {
    //#region TO SETUP THE FORM LOCALIZATION    

    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');

    // To setup the form id so will will get form labels based on form Id
    this.formId = 'SubscriptionDetails';

    // Check if LocalStorage is Not NULL
    if (localStorage.getItem('AppLabels') != null) {

      // Get data from LocalStorage
      this.AppFormLabels = JSON.parse(localStorage.getItem('AppLabels') || '{}');

      for (let labels of this.AppFormLabels) {

        if (labels.formID == this.formId && labels.language == this.languageType) {

          this.formHeaderLabels.push(labels);

          this.formBodyLabels.push(labels.formTitleDTLanguage);
          console.log(labels);
        }
      }
    }
    //#endregion
  
   
  }
  reloadPage(){
    let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
  }
}
