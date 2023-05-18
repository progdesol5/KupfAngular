import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ReturnTransactionHdDto } from 'src/app/modules/models/FinancialService/ReturnTransactionHdDto';
import { FormTitleDt } from 'src/app/modules/models/formTitleDt';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { CommonService } from 'src/app/modules/_services/common.service';
import { DbCommonService } from 'src/app/modules/_services/db-common.service';
import { FinancialService } from 'src/app/modules/_services/financial.service';
import { LocalizationService } from 'src/app/modules/_services/localization.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {

  //#region  Form Language Setting
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
  columnsToDisplay: string[] = ['action','transId', 'employeeName', 'services', 'installments', 'amount','dated','paid','payDate'];

  // Getting data as abservable.
  returnTransactionHdDto$: Observable<ReturnTransactionHdDto[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  returnTransactionHdDto: MatTableDataSource<ReturnTransactionHdDto> = new MatTableDataSource<any>([]);

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
  constructor(private common: CommonService, 
    private router: Router, 
    private financialService:FinancialService,
    private modalService: NgbModal,
    private toastrService:ToastrService) {
      this.formGroup = new FormGroup({
        searchTerm: new FormControl(null)
      })
     }

  ngOnInit(): void {
    this.formTitle = this.common.getFormTitle();
    //#region TO SETUP THE FORM LOCALIZATION    
    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');

    // To setup the form id so will will get form labels based on form Id
    this.formId = 'ServiceDetails';

    // Check if LocalStorage is Not NULL
    if (localStorage.getItem('AppLabels') != null) {

      // Get data from LocalStorage
      this.AppFormLabels = JSON.parse(localStorage.getItem('AppLabels') || '{}');

      for (let labels of this.AppFormLabels) {

        if (labels.formID == this.formId && labels.language == this.languageType) {

          this.formHeaderLabels.push(labels);

          this.formBodyLabels.push(labels.formTitleDTLanguage);

        }
      }
    }
    //#endregion
  
  //
  this.loadData();
  //
  
  }
  loadData(){
    this.financialService.GetFinancialServices().subscribe((response: ReturnTransactionHdDto[]) => {      
      this.returnTransactionHdDto = new MatTableDataSource<ReturnTransactionHdDto>(response);
      this.returnTransactionHdDto.paginator = this.paginator;
      this.returnTransactionHdDto.sort = this.sort;
      this.isLoadingCompleted = true;
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }
 //#region Material Search and Clear Filter
 filterRecords() {
  if (this.formGroup.value.searchTerm != null && this.returnTransactionHdDto) {
    this.returnTransactionHdDto.filter = this.formGroup.value.searchTerm.trim();
  }
}
clearFilter() {
  this.formGroup?.patchValue({ searchTerm: "" });
  this.filterRecords();
}
//#endregion

//#region Delete operation and Modal Config
openDeleteModal(content: any, id: number) {
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    if (result === 'yes') {
      console.log(id);
      this.financialService.DeleteFinancialService(id).subscribe(response => {
        if (response === 11) {
          this.toastrService.success('Record deleted successfully', 'Success');
          // Refresh Grid
          this.loadData();
        } else {
          this.toastrService.error('Something went wrong', 'Error');
        }
      });
    }
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });

}
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}
//#endregion

  //#region
  openLoanForm() {
    this.redirectTo('/service-setup/add-service');
  }
  getSelectedService(event: any) {
    this.selectedOpt = event.target.value;
    this.common.sendFormTitle(this.selectedOpt);
  }
  // Manually redirect to URL to dynamicall change title of form
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }
  //#endregion
   
 
}
