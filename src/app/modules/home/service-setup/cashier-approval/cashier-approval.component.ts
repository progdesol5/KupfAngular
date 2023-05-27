import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CashierApprovalDto } from 'src/app/modules/models/FinancialService/CashierApprovalDto';
import { ReturnTransactionHdDto } from 'src/app/modules/models/FinancialService/ReturnTransactionHdDto';
import { CommonService } from 'src/app/modules/_services/common.service';
import { FinancialService } from 'src/app/modules/_services/financial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cashier-approval',
  templateUrl: './cashier-approval.component.html',
  styleUrls: ['./cashier-approval.component.scss']
})

export class CashierApprovalComponent implements OnInit {

  //#region
  // To display table column headers
  columnsToDisplay: string[] = ['action', 'transId', 'periodCode', 'employee', 'mobile', 'service'];

  JvcolumnsToDisplay: string[] = ['accountid', 'accountname', 'cr', 'dr', 'amount'];
  // Getting data as abservable.
  cashierApprovalDto$: Observable<CashierApprovalDto[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  cashierApprovalDto: MatTableDataSource<CashierApprovalDto> = new MatTableDataSource<any>([]);
  JvDatasource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
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
  isShowAllChecked: boolean = false;

  constructor(private financialService: FinancialService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private router: Router,
    private commonService: CommonService) {
    this.formGroup = new FormGroup({
      searchTerm: new FormControl(null)
    })
  }

  ngOnInit(): void {
    //
    this.loadData();
  }
  navigateToCashierDraft(mytransId: number, employeeId: number) {
    this.router.navigateByUrl(`/service-setup/cashier-draft?mytransId=${mytransId}&employeeId=${employeeId}`);
  }
  navigateToCashierDelivery(mytransId: number, employeeId: number) {
    this.router.navigateByUrl(`/service-setup/cashier-delivery?mytransId=${mytransId}&employeeId=${employeeId}`);
  }
  onDetailsClick(transId: number) {
    //this.commonService.isViewOnly = true;
    this.redirectTo(`/service-setup/view-service-detail/${transId}`);
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }
  loadData(isShowAll: boolean = false) {
    //   
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);
    const periodCode = data.map((obj: { periodCode: any; }) => obj.periodCode);
    const prevPeriodCode = data.map((obj: { prevPeriodCode: any; }) => obj.prevPeriodCode);
    //
    this.financialService.GetCashierApprovals(periodCode, tenantId, locationId, isShowAll).subscribe((response: CashierApprovalDto[]) => {
      this.cashierApprovalDto = new MatTableDataSource<CashierApprovalDto>(response);
      this.cashierApprovalDto.paginator = this.paginator;
      this.cashierApprovalDto.sort = this.sort;
      this.isLoadingCompleted = true;
      console.log(response)
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }
  onShowAllChange(event: any) {
    this.isShowAllChecked = event.target.checked;
    this.loadData(event.target.checked)
  }
  //#region Material Search and Clear Filter 
  filterRecords() {
    if (this.formGroup.value.searchTerm != null && this.cashierApprovalDto) {
      this.cashierApprovalDto.filter = this.formGroup.value.searchTerm.trim();
    }
  }
  clearFilter() {
    this.formGroup?.patchValue({ searchTerm: "" });
    this.filterRecords();
  }
  //#endregion
  jvDetail: any;
  crTotal:number=0;
  drTotal:number=0;
  openJvModal(content: any, id: any) {
    this.financialService.GetVoucherByTransId(id).subscribe((res: any) => {
      if (res.length == 0) {
        this.toastrService.warning("No data found", "Warning");
      } else {
        this.JvDatasource = new MatTableDataSource<CashierApprovalDto>(res);

        res.map((x:any)=>{
          this.crTotal += x.cr;
          this.drTotal += x.dr;
        })
        // this.jvDetail = res;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', modalDialogClass: 'modal-lg' });
      }
    })
  }
}
