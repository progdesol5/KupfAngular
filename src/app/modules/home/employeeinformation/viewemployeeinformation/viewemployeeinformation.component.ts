import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DeleteDataDto } from 'src/app/modules/models/DeleteDataDto';
import { DetailedEmployee } from 'src/app/modules/models/DetailedEmployee';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { Pagination } from 'src/app/modules/models/pagination';
import { UserParams } from 'src/app/modules/models/UserParams';
import { EmployeeService } from 'src/app/modules/_services/employee.service';

@Component({
  selector: 'app-viewemployeeinformation',
  templateUrl: './viewemployeeinformation.component.html',
  styleUrls: ['./viewemployeeinformation.component.scss']
})
export class ViewemployeeinformationComponent implements OnInit {




  //  
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
dirval = localStorage.getItem('lang')
  /*----------------------------------------------------*/
  //#endregion

  //#region
  // To display table column headers
  columnsToDisplay: string[] = ['action', 'IdPfIdCivilId', 'mobileNo', 'employeeName', 'source', 'department'];

  // Getting data as abservable.
  detailedEmployee$: Observable<DetailedEmployee[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  detailedEmployee: MatTableDataSource<DetailedEmployee> = new MatTableDataSource<any>([]);

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

  //local Storage Emploee Details
  localStorageEmployee: DetailedEmployee[] = [];
  //#endregion

  lang: any = '';
  // Modal close result...
  closeResult = '';
  userParams: UserParams;
  pagination: Pagination;
  //
  currentPage = 0;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  employeeHeaders: any = {};
  FilterArray: any = [
    { id: 2, name: 'Subscribed' },
    { id: 9, name: 'Rejected' },
    { id: 12, name: 'Terminated' }
  ];
  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.formGroup = new FormGroup({
      searchTerm: new FormControl(null)
    })
    this.userParams = this.employeeService.getUserParams();
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang');

    //#region TO SETUP THE FORM LOCALIZATION    
    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');

    // To setup the form id so will will get form labels based on form Id
    this.formId = 'EmployeeGrid';

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
    this.loadData(0);
  }
  loadData(pageIndex: any) {
    console.log(pageIndex)
    //
    console.log(this.userParams);
    this.employeeService.setUserParams(this.userParams);
    //this.detailedEmployee = [];
    this.employeeService.GetAllEmployees(this.userParams).subscribe((response: any) => {

      this.employeeHeaders = JSON.parse(response.headers.get('pagination'));

      this.detailedEmployee = new MatTableDataSource<DetailedEmployee>(response.body);
      this.detailedEmployee.paginator = this.paginator;
      this.detailedEmployee.sort = this.sort;
      this.isLoadingCompleted = true;
      setTimeout(() => {
        this.paginator.pageIndex = pageIndex;
        this.paginator.length = this.employeeHeaders.totalItems;
      });
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }
  pageChanged(event: any) {
    if (event.pageIndex == 0) {
      this.userParams.pageNumber = event.pageIndex + 1
    } else if (event.length <= (event.pageIndex * event.pageSize + event.pageSize)) {
      this.userParams.pageNumber = event.pageIndex + 1;
    }
    else if (event.previousPageIndex > event.pageIndex) {
      this.userParams.pageNumber = event.pageIndex;
    } else {
      this.userParams.pageNumber = event.pageIndex + 1
    }
    this.userParams.pageSize = event.pageSize;
    this.employeeService.setUserParams(this.userParams);
    if(this.formGroup.value.searchTerm == null){
      this.loadData(event.pageIndex);
    }
    else if(this.formGroup.value.searchTerm.length>0){
      this.filterRecords(event.pageIndex);
    }
    else{
      this.loadData(event.pageIndex);
    }  
  }
  //#region Material Search and Clear Filter  
  filterRecords(pageIndex:any) {
    this.userParams.pageNumber = pageIndex + 1;
    console.log(this.userParams);
    this.employeeService.setUserParams(this.userParams);
    this.employeeService.GetFilterEmployees(this.userParams, this.formGroup.value.searchTerm).subscribe((response: any) => {
      this.employeeHeaders = JSON.parse(response.headers.get('pagination'));
      this.detailedEmployee = new MatTableDataSource<DetailedEmployee>(response.body);
      this.detailedEmployee.paginator = this.paginator;
      this.detailedEmployee.sort = this.sort;
      this.isLoadingCompleted = true;
      setTimeout(() => {
        this.paginator.pageIndex = pageIndex;
        this.paginator.length = this.employeeHeaders.totalItems;
      });
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }
  clearFilter() {
    this.formGroup?.patchValue({ searchTerm: "" });
    this.loadData(0);
    this.userParams.pageNumber = 1;
    this.userParams.pageSize= 10;
    // this.filterRecords(0);
  }
  //#endregion

  //#region Delete operation and Modal Config
  open(content: any, dtailedEmployee: DetailedEmployee) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        // Get logged In user info...
        var data = JSON.parse(localStorage.getItem("user")!);
        const userId = data.map((obj: { userId: any; }) => obj.userId);
        const username = data.map((obj: { username: any; }) => obj.username);
        const locationId = data.map((obj: { locationId: any; }) => obj.locationId);
        const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
        dtailedEmployee.userId = userId[0];
        dtailedEmployee.username = username[0];
        dtailedEmployee.locationId = locationId[0];
        dtailedEmployee.tenentId = tenantId[0];
        this.employeeService.DeleteEmployee(dtailedEmployee).subscribe(
          res => {
            this.toastr.success('Deleted Successfully', 'Deleted')
          },
          error => {
            console.log(error);
          }, () => {
            // TO REFRESH / RELOAD THE PAGE WITHOUT REFRESH THE WHOLE PAGE.
            this.loadData(0);
          })
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

  onFilterItemSelect(e: any) {
    //
    if(!e){
      this.loadData(0);
    }
    this.employeeService.setUserParams(this.userParams);
    //this.detailedEmployee = [];
    this.employeeService.FilterEmployee(this.userParams, e).subscribe((response: any) => {

      this.employeeHeaders = JSON.parse(response.headers.get('pagination'));

      this.detailedEmployee = new MatTableDataSource<DetailedEmployee>(response.body);
      this.detailedEmployee.paginator = this.paginator;
      this.detailedEmployee.sort = this.sort;
      this.isLoadingCompleted = true;
      setTimeout(() => {
        this.paginator.pageIndex = 0;
        this.paginator.length = this.employeeHeaders.totalItems;
      });
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }
}
