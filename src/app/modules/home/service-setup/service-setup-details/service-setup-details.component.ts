import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { ServiceSetupDto } from 'src/app/modules/models/ServiceSetup/ServiceSetupDto';
import { CommonService } from 'src/app/modules/_services/common.service';
import { LocalizationService } from 'src/app/modules/_services/localization.service';
import { ServiceSetupService } from 'src/app/modules/_services/service-setup.service';

@Component({
  selector: 'app-service-setup-details',
  templateUrl: './service-setup-details.component.html',
  styleUrls: ['./service-setup-details.component.scss']
})
export class ServiceSetupDetailsComponent implements OnInit {

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
  columnsToDisplay: string[] = ['action', 'services', 'serviceType', 'minMax', 'discountAllow','forEmployee'];

  // Getting data as abservable.
  serviceSetupDto$: Observable<ServiceSetupDto[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  serviceSetupDto: MatTableDataSource<ServiceSetupDto> = new MatTableDataSource<any>([]);

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
  //
  lang: any = '';
  //
  closeResult: string = '';
  
  //
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  employeeHeaders: any = {};
  // 
  formTitle:string;
  constructor(
    private common: CommonService,
    private serviceSetup: ServiceSetupService,
    private modalService: NgbModal,
    private toastrService: ToastrService) {       
      this.formGroup = new FormGroup({
        searchTerm: new FormControl("")
      })
    }

  ngOnInit(): void {    
    this.lang = localStorage.getItem('lang');
    this.formTitle = this.common.getFormTitle();
    this.formTitle = '';
    //#region TO SETUP THE FORM LOCALIZATION    
    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');

    // To setup the form id so will will get form labels based on form Id
    this.formId = 'ServiceSetupDetail';

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
    this.loadData();
  }
loadData()
{
  this.serviceSetupDto$ = this.serviceSetup.GetAllServiceSetupRecords();
    this.serviceSetupDto$.subscribe((response: ServiceSetupDto[]) => {
      this.serviceSetupDto = new MatTableDataSource<ServiceSetupDto>(response);
      this.serviceSetupDto.paginator = this.paginator;
      this.serviceSetupDto.sort = this.sort;
      this.isLoadingCompleted = true;
      console.log(this.serviceSetupDto);    
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
}
  // Delete recored...
  openDeleteModal(content: any, id: number) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.serviceSetup.DeleteServiceSetup(id).subscribe(response => {
          if (response === 1) {
            this.toastrService.success('Record deleted successfully', 'Success');
            // Refresh Grid
            this.loadData();
          } else {
            this.toastrService.error('Something went wrong', 'Errro');
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


  //#region Material Search and Clear Filter
  filterRecords() {
    
    if (this.formGroup.value.searchTerm != null && this.serviceSetupDto) {
      this.serviceSetupDto.filter = this.formGroup.value.searchTerm.trim();
    }
  }
  clearFilter() {
    this.formGroup?.patchValue({ searchTerm: "" });
    this.filterRecords();
  }
  //#endregion
}
