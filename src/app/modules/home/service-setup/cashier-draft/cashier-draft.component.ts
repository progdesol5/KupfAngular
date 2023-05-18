import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { isError } from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { SelectBankAccount } from 'src/app/modules/models/SelectBankAccount';
import { DbCommonService } from 'src/app/modules/_services/db-common.service';
import { FinancialService } from 'src/app/modules/_services/financial.service';

@Component({
  selector: 'app-cashier-draft',
  templateUrl: './cashier-draft.component.html',
  styleUrls: ['./cashier-draft.component.scss']
})
export class CashierDraftComponent implements OnInit {

  //
  cashierDraftForm: FormGroup;
  transId: number;
  employeeId: number
  //
  isFormSubmitted=false;
  //
  selectBankAccount$: Observable<SelectBankAccount[]>;
  
  constructor(private fb: FormBuilder,
    private dbCommonService: DbCommonService,
    private activatedRoute: ActivatedRoute,
    private financialService:FinancialService,
    private toastrService:ToastrService,
    private router: Router, 
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.transId = params['mytransId'];
      this.employeeId = params['employeeId'];
    });
  }

  ngOnInit(): void {
    // Get Tenant Id
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);
    const username = data.map((obj: { username: any; }) => obj.username);
    //
    this.initializeCashierDeliveryForm();
    //
    this.selectBankAccount$ = this.dbCommonService.GetBankAccounts(tenantId, locationId);
    //
    this.dbCommonService.GetDraftInformationByEmployeeId(this.employeeId, tenantId, locationId, this.transId).subscribe((response: any) => {
      
      this.cashierDraftForm.patchValue({
        totalAmount: response.totalAmount.toFixed(3),
        bankAccount1: +response.bankAccount1,
        draftNumber1: response.draftNumber1,
        draftDate1: response.draftDate1 ? new Date(response.draftDate1) : new Date(),
        receivedBy1: response.receivedBy1,
        receivedDate1: response.receivedDate1 ? new Date(response.receivedDate1) : new Date(),
        deliveredBy1: username[0],
        deliveryDate1: response.deliveryDate1 ? new Date(response.deliveryDate1) : new Date(), 
        pfid: response.pfid,
        empCidNum: response.empCidNum,
        arabicName: response.arabicName,
        englishName: response.englishName,
        transId:this.transId,
        employeeId:this.employeeId,
        benefeciaryName:response.benefeciaryName,
        accountantId:response.accountantID,
        chequeAmount:response.chequeAmount,
        chequeDate :response.chequeDate ? new Date(response.chequeDate) : new Date()

      })
    }, error => {
      console.log(error);
    })
  }

  onSaveClick(){
    this.isFormSubmitted = true;
    if(this.cashierDraftForm.valid){
      this.financialService.CreateCahierDraft(this.cashierDraftForm.value).subscribe((response:any)=>{
        if(response === 1){
          this.toastrService.success('Saved successfully','Success');
          this.redirectTo(`/service-setup/cashier-approval`);
        }else{
          this.toastrService.error('Something went wrong','Error');
        }
      },error=>{
        console.log(error)
      })
    }    
  }
  initializeCashierDeliveryForm() {
    this.cashierDraftForm = this.fb.group({
      totalAmount: new FormControl('0'),
      bankAccount1: new FormControl('',Validators.required),
      draftNumber1: new FormControl('0'),
      draftDate1: new FormControl(null),
      receivedBy1: new FormControl(''),
      receivedDate1: new FormControl(null),
      deliveredBy1: new FormControl(),
      pfid: new FormControl(),
      empCidNum: new FormControl(),
      employeeId: new FormControl(),
      arabicName: new FormControl(),
      englishName: new FormControl(),
      deliveryDate1: new FormControl(null),
      transId:new FormControl(''),
      accountantId: new FormControl(''),
      benefeciaryName: new FormControl(''),
      chequeNumber: new FormControl(''),
      chequeDate: new FormControl(''),
      chequeAmount: new FormControl(''),
      collectedBy: new FormControl(''),
      relationship: new FormControl(''),
      collectedPersonCID: new FormControl(''),
    })
  }
  
  
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }
  // To access form controls...
  get cashierDraftFrm() { return this.cashierDraftForm.controls; }
}
