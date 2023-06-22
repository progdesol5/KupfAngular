import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FunctionMst } from 'src/app/modules/models/FunctionMst';
import { Login } from 'src/app/modules/models/login';
import { FunctionMstService } from 'src/app/modules/_services/function-mst.service';
import { UserParams } from 'src/app/modules/models/UserParams';

@Component({
  selector: 'app-function-mst',
  templateUrl: './function-mst.component.html',
  styleUrls: ['./function-mst.component.scss']
})
export class FunctionMstComponent implements OnInit {


  //#region
  // To display table column headers
  columnsToDisplay: string[] = ['action', 'ModuleId', 'MenuType', 'MenuName1', 'MenuName2', 'MenuName3', 'Link'];

  // Getting data as abservable.
  functionMst$: Observable<FunctionMst[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  functionMst: MatTableDataSource<FunctionMst> = new MatTableDataSource<any>([]);

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
  functionMstHeaders: any = {};

  // formGroup
  formGroup: FormGroup;

  // Search Term
  searchTerm: string = '';
  //#endregion

  datePickerConfig: Partial<BsDatepickerConfig> | undefined;
  //
  mainFormGroup!: FormGroup;
  //
  isLinear = false;
  //
  // Modal close result...
  closeResult = '';
  //
  singleFunctionMst:FunctionMst[]=[];

  activeMenuStatus: number | undefined;
  activeMenuStatusArray = [
    { id: 0, name: 'No' },
    { id: 1, name: 'Yes' }
  ];
  userParams: UserParams;

  constructor(
    private functionMstService: FunctionMstService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
       
    this.formGroup = new FormGroup({
      searchTerm: new FormControl("")
    })
    this.datePickerConfig = Object.assign({}, { containerClass: 'theme-dark-blue' })
    this.userParams = this.functionMstService.getUserParams(); 
  }

  

  ngOnInit(): void {
    // Initialize Form
    this.initializeForm();

    // Load Data
    this.loadData(0);

  }
  // // Initialize Form
  initializeForm() {
    this.mainFormGroup = new FormGroup({
      menuFormGroup: new FormGroup({
        menU_ID: new FormControl(null, [Validators.required]),
        masteR_ID: new FormControl(null, [Validators.required]),
        modulE_ID: new FormControl(null, [Validators.required]),
        menU_TYPE: new FormControl(null, [Validators.required]),
        menU_NAME1: new FormControl(null, [Validators.required]),
        menU_NAME2: new FormControl(null, [Validators.required]),
        menU_NAME3: new FormControl(null, [Validators.required]),
      }),
      managementFormGroup: new FormGroup({
        link: new FormControl(null, [Validators.required]),
        urloption: new FormControl(null, [Validators.required]),
        urlrewrite: new FormControl(null, [Validators.required]),
        menU_LOCATION: new FormControl(null, [Validators.required]),
        menU_ORDER: new FormControl(null, [Validators.required]),
        doC_PARENT: new FormControl(null, [Validators.required]),
      }),

      activeMenuFormGroup: new FormGroup({
        activemenu: new FormControl(null, [Validators.required]),
        activetilldate: new FormControl(null, [Validators.required]),
      }),
      basicFlagsFormGroup: new FormGroup({
        addflage: new FormControl(null, [Validators.required]),
        editflage: new FormControl(null, [Validators.required]),
        delflage: new FormControl(null, [Validators.required]),
        mypersonal: new FormControl(null, [Validators.required]),
      }),
      extendedFlagsFormGroup: new FormGroup({
        sP1: new FormControl(null, [Validators.required]),
        sP2: new FormControl(null, [Validators.required]),
        sP3: new FormControl(null, [Validators.required]),
        sP4: new FormControl(null, [Validators.required]),
        sP5: new FormControl(null, [Validators.required]),
      })
    });
  }

  // Add new function mst...
  AddNewFunctionMst() {

    // Get Tenant Id
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);

    //  TO CONVER OBJECT ARRAY AS SIMPLE ARRAY. 
    let functionData = {
      ...this.mainFormGroup.value.menuFormGroup,
      ...this.mainFormGroup.value.managementFormGroup,
      ...this.mainFormGroup.value.activeMenuFormGroup,
      ...this.mainFormGroup.value.basicFlagsFormGroup,
      ...this.mainFormGroup.value.extendedFlagsFormGroup,
      tenentID: tenantId[0], cruP_ID: 0
    }
    //
    this.functionMstService.AddFunctionMst(functionData).subscribe(() => {
      this.toastr.success('Saved successfully', 'Success');
      this.mainFormGroup.reset();
    }, error => {
      if (error.status === 500) {
        this.toastr.error('Duplicate value found', 'Error');
      }
    })

  }
  
  //
  GetFunctionMstById(id:number){
   this.functionMst$ = this.functionMstService.GetFunctionMstById(id);
   this.functionMst$.subscribe((response)=>{
    this.singleFunctionMst = response;
    console.log(this.singleFunctionMst[0]?.menU_ID);
    console.log(this.singleFunctionMst);
    // for (let i = 0; i < this.singleFunctionMst.length; i++) {
    //   console.log('OK');
    //   // this.mainFormGroup = new FormGroup({
    //   //   menuFormGroup: new FormGroup({
    //   //     menU_ID: new FormControl(this.singleFunctionMst[i].menU_ID, [Validators.required]),
    //   //     masteR_ID: new FormControl(null, [Validators.required]),
    //   //     modulE_ID: new FormControl(null, [Validators.required]),
    //   //     menU_TYPE: new FormControl(null, [Validators.required]),
    //   //     menU_NAME1: new FormControl(null, [Validators.required]),
    //   //     menU_NAME2: new FormControl(null, [Validators.required]),
    //   //     menU_NAME3: new FormControl(null, [Validators.required]),
    //   //   }),
    //   // })
    // }
  

   },error=>{
    console.log(error.error);
   })
   
  }
  //#region Delete operation and Modal Config
  open(content: any, id: number) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        console.log(id);
        this.functionMstService.DeleteFunctionMst(id).subscribe(
          res => {
            this.loadData(0);
            this.toastr.success('Deleted Successfully', 'Deleted')
          },
          error => {
            console.log(error);
          }, () => {

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

  //#region
  loadData(pageIndex: number) {   
    this.userParams.pageNumber = pageIndex + 1;
    this.functionMstService.setUserParams(this.userParams);

    this.functionMstService.getAllFunctionMst(this.userParams, this.formGroup.value.searchTerm).subscribe((response: any) => {
      this.functionMstHeaders = JSON.parse(response.headers.get('pagination'));
      this.functionMst = new MatTableDataSource<FunctionMst>(response.body);
      this.functionMst.paginator = this.paginator;
      this.functionMst.sort = this.sort;
      this.isLoadingCompleted = true;

      setTimeout(() => {
        this.paginator.pageIndex = pageIndex;
        this.paginator.length = response.body.totalRecords;
      });
    }, error => {
      // Incase of any error
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }
  //
  filterRecords(pageIndex: number = -1) {
    if (this.formGroup.value.searchTerm != null && this.functionMst) {
      this.formGroup.value.searchTerm = this.functionMst.filter = this.formGroup.value.searchTerm.trim();
    }
    if( pageIndex == 0) this.loadData(0);
    else this.loadData(this.paginator.pageIndex);
  }
  clearFilter() {
    this.formGroup?.patchValue({ searchTerm: "" });
    this.filterRecords();
  }
  //#endregion
  pageChanged(event: any) {
    if (event.pageIndex == 0) {
      this.userParams.pageNumber = event.pageIndex + 1
    } else if (event.length <= (event.pageIndex * event.pageSize + event.pageSize)) {
      this.userParams.pageNumber = event.pageIndex + 1;
    } else if (event.previousPageIndex > event.pageIndex) {
      this.userParams.pageNumber = event.pageIndex;
    } else {
      this.userParams.pageNumber = event.pageIndex + 1
    }
    this.userParams.pageSize = event.pageSize;
    this.functionMstService.setUserParams(this.userParams);
    if (this.formGroup.value.searchTerm == null) {
      this.loadData(event.pageIndex);
    }
    else if (this.formGroup.value.searchTerm.length > 0) {
      this.filterRecords();
    }
    else {
      this.loadData(event.pageIndex);
    }
  }

}
