import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FinancialService } from 'src/app/modules/_services/financial.service';
import { CashierApprovalDto } from 'src/app/modules/models/FinancialService/CashierApprovalDto';
import { voucherDto } from 'src/app/modules/models/VoucherDto';


@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {

  //#region
  // To display table column headers
  columnsToDisplay: string[] = ['action', 'status', 'services', 'empname', 'cepfid', 'transid', 'jvid'];

  // Getting data as abservable.
  voucherDto$: Observable<voucherDto[]>;

  // We need a normal array of data so we will subscribe to the observable and will get data
  voucherDto: MatTableDataSource<voucherDto> = new MatTableDataSource<any>([]);

  // Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Sorting
  @ViewChild(MatSort) sort!: MatSort;

  // Hide footer while loading.
  isLoadingCompleted: boolean = true;

  // Incase of any error will display error message.
  dataLoadingStatus: string = '';

  // True of any error
  isError: boolean = false;

  // formGroup
  formGroup: FormGroup;

  // Search Term
  searchTerm: string = '';
  //#endregion
  voucherDetail:any;
  constructor(private financialService: FinancialService, private router: Router, private modalService: NgbModal) {
    this.formGroup = new FormGroup({
      searchTerm: new FormControl("")
    })
  }

  ngOnInit(): void {
    this.loadData();
  }
length:number;
pageSize:number = 10;

  loadData() {
    this.financialService.GetVouchers(1, this.pageSize, this.formGroup.value.searchTerm).subscribe((response: any) => {
      this.voucherDto = new MatTableDataSource<any>(response.voucherDto);
      this.voucherDto.paginator = this.paginator;
      this.voucherDto.sort = this.sort;
      this.length = response.totalRecords;
      this.isLoadingCompleted = true;
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }

  onPaginationChange(event:any){
    this.financialService.GetVouchers(event.pageIndex+1, event.pageSize, this.formGroup.value.searchTerm).subscribe((response: any) => {
      this.voucherDto = new MatTableDataSource<any>(response.voucherDto);
      //this.voucherDto.paginator = this.paginator;
      this.length = response.totalRecords
      this.voucherDto.sort = this.sort;
      this.isLoadingCompleted = true;
      //console.log(this.voucherDto);
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }
  // navigateToVoucherDetails(voucherId: number) {
  //   this.router.navigateByUrl(`/service-setup/voucher-details?voucherId=${voucherId}`);
  // }
  // redirectTo(uri: string) {
  //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //     this.router.navigate([uri]));
  // }
  //#region Material Search and Clear Filter 
  filterRecords() {
    this.financialService.GetVouchers(1, this.pageSize, this.formGroup.value.searchTerm).subscribe((response: any) => {
      this.voucherDto = new MatTableDataSource<any>(response.voucherDto);
      this.voucherDto.paginator = this.paginator;
      this.length = response.totalRecords
      this.voucherDto.sort = this.sort;
      this.isLoadingCompleted = true;
    }, error => {
      console.log(error);
      this.dataLoadingStatus = 'Error fetching the data';
      this.isError = true;
    })
  }
  clearFilter() {
      this.formGroup?.patchValue({ searchTerm: "" });
      this.filterRecords();
  }
  //#endregion

  openVoucherModal(content: any, id: any) {
    this.financialService.GetVoucherDetails(id).subscribe((res:any) => {
      this.voucherDetail = res;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', modalDialogClass: 'modal-md' });
    })
  }
}
