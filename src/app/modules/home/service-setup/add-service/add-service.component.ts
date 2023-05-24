import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, takeUntil, takeWhile } from 'rxjs';
import { TransactionHdDto } from 'src/app/modules/models/FinancialService/TransactionHdDto';
import { FormTitleHd } from 'src/app/modules/models/formTitleHd';
import { SelectOccupationsDto } from 'src/app/modules/models/SelectOccupationsDto';
import { SelectSubServiceTypeDto } from 'src/app/modules/models/SelectSubServiceTypeDto';
import { SelectServiceTypeDto } from 'src/app/modules/models/ServiceSetup/SelectServiceTypeDto';
import { CommonService } from 'src/app/modules/_services/common.service';
import { DbCommonService } from 'src/app/modules/_services/db-common.service';
import { FinancialService } from 'src/app/modules/_services/financial.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit, OnDestroy {
  // Getting base URL of Api from enviroment.
  baseUrl = environment.KUPFApiUrl;

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

  formTitle: string;
  closeResult: string = '';

  selectServiceType$: Observable<SelectServiceTypeDto[]>;
  selectServiceType: SelectServiceTypeDto[] = [];
  selectServiceSubType$: Observable<SelectServiceTypeDto[]>;
  selectServiceSubType: SelectSubServiceTypeDto[] = [];
  selectedServiceType: any;
  selectedServiceTypeText: any;
  selectedServiceSubType: any;
  selectedServiceSubTypeText: any;
  //
  parentForm: FormGroup;
  addServiceForm: FormGroup;
  financialCalculationForm: FormGroup;
  cashierInformationForm: FormGroup;
  popUpForm: FormGroup;
  isFormSubmitted = false;
  minDate: Date;
  editService$: Observable<TransactionHdDto[]>;
  mytransid: any;
  isObservableActive = true;
  pfId: any;
  isSubscriber = false;
  contractType$:Observable<SelectOccupationsDto[]>;
  // If PF Id is Not Null - SubscribeDate = Null and TerminationDate = Null
  notSubscriber: boolean = false;
  // 
  @ViewChild('popupModal', { static: true }) popupModal: ElementRef;
  //
  employeeForm: FormGroup | undefined;
  searchForm: FormGroup;
  genderArray: any = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];
  maritalStatusArray: any = [
    { id: 1, name: 'Married' },
    { id: 2, name: 'Single' }
  ];
  @Input() arabicFont: string = 'font-family:"Tahoma","sans-serif"';
  @Input() pageName: string;
  isViewOnly: Boolean;
  // If Pf Id is null we will hide financial calculation div...
  isPFIdNull: boolean = false;
  //
  myTransId: any;
  //
  serviceTypeSelected: any;
  serviceSubTypeSelected: any;
  // To Set/Get discount type
  allowedDiscountType: any;
  //
  isSearched: boolean = false;
  //
  isPfIdExists: boolean = false;
  constructor(
    private financialService: FinancialService,
    private commonService: DbCommonService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private activatedRout: ActivatedRoute,
    public common: CommonService,
    public datepipe: DatePipe,
    private router: Router,
    private modalService: NgbModal) {

    this.setUpParentForm();

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    //
    this.mytransid = this.activatedRout.snapshot.paramMap.get('mytransid');
  }

  ngOnInit(): void {
    //#region TO SETUP THE FORM LOCALIZATION    
    // TO GET THE LANGUAGE ID e.g. 1 = ENGLISH and 2 =  ARABIC
    this.languageType = localStorage.getItem('langType');

    // To get the selected language...
    this.language = localStorage.getItem('lang');

    // To setup the form id so will will get form labels based on form Id
    this.formId = 'AddService';

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

    // To FillUp Contract Types
    this.contractType$ = this.commonService.GetContractType();
    //
    this.initializeAddServiceForm();
    //
    this.initPopUpModal();
    //
    this.setValidators(this.notSubscriber);
    // 
    this.initializeEmployeeForm();
    //
    this.initializeSearchForm();
    //
    this.initializeFinancialForm();
    //
    this.initializeCashierInformationForm();
    // Get Tenant Id
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { location: any; }) => obj.location);

    //

    if (this.mytransid) {
      this.common.ifEmployeeExists = true;
      // To display other Accordians
      this.isSearched = true;
      if (this.common.isViewOnly === true) {
        // If user comes from Cashier Approval...
        this.isViewOnly = true;
      }
      // To Select selected service type  
      this.financialService.GetServiceType(tenantId).subscribe((response: any) => {
        this.selectServiceType = response;
      });
      //
      this.financialService.GetFinancialServiceById(this.mytransid).subscribe((response: any) => {
        console.log('edit service',response);
        this.allowedDiscountType = response.discountType;
        this.serviceTypeSelected = response.serviceType;
        this.parentForm.patchValue({
          employeeForm: {
            employeeId: response.employeeId,
            englishName: response.englishName,
            arabicName: response.arabicName,
            empGender: response.empGender,
            joinedDate: moment(response.joinedDate).format("DD-MM-yyyy"),
            empBirthday: new Date(response.empBirthday),
            mobileNumber: response.mobileNumber,
            empMaritalStatus: +response.empMaritalStatus,
            nationName: response.nationName,
            contractType: +response.contractType,
            subscriptionAmount: response.subscriptionAmount,
            subscriptionPaid: response.subscriptionPaid,
            lastSubscriptionPaid: response.lastSubscriptionPaid,
            subscriptionDueAmount: response.subscriptionDueAmount,
            subscriptionStatus: response.subscriptionStatus,
            terminationDate: response.terminationDate,
            endDate: response.endDate,
            employeeStatus: response.employeeStatus,
            CountryNameEnglish: response.nationName,
            CountryNameArabic: response.nationName,
            employeePFId: response.pfid,
            employeeCID: response.empCidNum,
            employeeFormEmployeeId: response.employeeId,
            kinMobile:response.kinMobile,
            kinName:response.kinName,
            salary:response.salary
          },
          addServiceForm: {
            mytransid: response.mytransid,
            serviceType: response.serviceTypeId,
            serviceSubType: response.serviceSubTypeId,
            totinstallments: response.totinstallments,
            totamt: response.totamt,
            installmentAmount: response.installmentAmount,
            installmentsBegDate: response.installmentsBegDate ? new Date(response.installmentsBegDate) : '',
            untilMonth: response.untilMonth,
            downPayment: response.downPayment,
            pfId: response.pfid,
            allowDiscountAmount: response.allowDiscountAmount,
            discountType: response.discountType,
            serviceTypeId: response.serviceTypeId,
            serviceSubTypeId: response.serviceSubTypeId,
            allowDiscountDefault: response.allowDiscountDefault,
            searialNo:response.mytransid
          },
          financialForm: {
            hajjAct: response.hajjAct,
            loanAct: response.loanAct,
            persLoanAct: response.persLoanAct,
            otherAct1: response.otherAct1,
            otherAct2: response.otherAct2,
            otherAct3: response.otherAct3,
            otherAct4: response.otherAct4,
            otherAct5: response.otherAct5,
          },
          // approvalDetailsForm: {
          //   serApproval1: response.serApproval1,
          //   approvalBy1: response.approvalBy1,
          //   approvedDate1: response.approvedDate1,
          //   serApproval2: response.serApproval2,
          //   approvalBy2: response.approvalBy2,
          //   approvedDate2: response.approvedDate2,
          //   serApproval3: response.serApproval3,
          //   approvalBy3: response.approvalBy3,
          //   approvedDate3: response.approvedDate3,
          //   serApproval4: response.serApproval4,
          //   approvalBy4: response.approvalBy4,
          //   approvedDate4: response.approvedDate4,
          //   serApproval5: response.serApproval5,
          //   approvalBy5: response.approvalBy5,
          //   approvedDate5: response.approvedDate5,
          // },
          // documentAttachmentForm: {
          //   docType: response.transactionHDDMSDto[0].docType,
          //   docType1: response.transactionHDDMSDto[1].docType,
          //   docType2: response.transactionHDDMSDto[2].docType,
          //   docType3: response.transactionHDDMSDto[3].docType,
          //   docType4: response.transactionHDDMSDto[4].docType,
          //   attachmentByName: response.transactionHDDMSDto[0].attachmentByName,
          //   attachmentByName1: response.transactionHDDMSDto[1].attachmentByName,
          //   attachmentByName2: response.transactionHDDMSDto[2].attachmentByName,
          //   attachmentByName3: response.transactionHDDMSDto[3].attachmentByName,
          //   attachmentByName4: response.transactionHDDMSDto[4].attachmentByName,
          // }
        })
        this.commonService.GetSubServiceTypeByServiceType(tenantId, response.serviceTypeId).subscribe((response: any) => {
          this.selectServiceSubType = response;
        });

      })
      //
      this.enableDisableControls(this.addServiceForm.get('allowDiscountDefault')?.value)
      this.addServiceForm.get('pfId')?.disable();
      this.employeeForm?.get('contractType')?.disable();
    }

  }

  ngOnDestroy(): void {
    this.isObservableActive = false;
    this.isSubscriber = false;
    this.common.isViewOnly = false;
    this.isPFIdNull = false;
    this.isSearched = false;
  }

  setUpParentForm() {
    this.parentForm = this.fb.group({});
  }
  initializeEmployeeForm() {
    this.employeeForm = new FormGroup({
      employeeId: new FormControl(''),
      englishName: new FormControl('', Validators.required),
      arabicName: new FormControl('', Validators.required),
      empGender: new FormControl('', Validators.required),
      joinedDate: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.required),
      empMaritalStatus: new FormControl('', Validators.required),
      nationName: new FormControl('', Validators.required),
      contractType: new FormControl('', Validators.required),
      kinName: new FormControl('', Validators.required),
      kinMobile: new FormControl('', Validators.required),
      subscriptionAmount: new FormControl('', Validators.required),
      subscriptionPaid: new FormControl('', Validators.required),
      lastSubscriptionPaid: new FormControl(''),
      subscriptionDueAmount: new FormControl(''),
      subscriptionStatus: new FormControl(''),
      terminationDate: new FormControl(''),
      endDate: new FormControl(''),
      employeeStatus: new FormControl(''),
      isKUEmployee: new FormControl(''),
      // isOnSickLeave: new FormControl(''),
      // isMemberOfFund: new FormControl(''),
      CountryNameEnglish: new FormControl(''),
      CountryNameArabic: new FormControl(''),
      employeePFId: new FormControl(''),
      employeeCID: new FormControl(''),
      employeeFormEmployeeId: new FormControl(''),
      salary: new FormControl('0')
    })
    this.parentForm.setControl('employeeForm', this.employeeForm);
  }
  initializeSearchForm() {
    this.searchForm = new FormGroup({
      employeeId: new FormControl(0, Validators.required),
      pfId: new FormControl('', Validators.required),
      cId: new FormControl('', Validators.required),
    })
  }
  initializeAddServiceForm() {
    this.addServiceForm = this.fb.group({
      mytransid: new FormControl('0'),
      serviceSubType: new FormControl('', Validators.required),
      serviceType: new FormControl('', Validators.required),
      searialNo: new FormControl('', Validators.required),
      totamt: new FormControl('0', Validators.required),
      totinstallments: new FormControl('0', Validators.required),
      allowDiscount: new FormControl('', Validators.required),
      installmentAmount: new FormControl('0', Validators.required),
      installmentsBegDate: new FormControl('', Validators.required),
      untilMonth: new FormControl('', Validators.required),
      serviceSubTypeId: new FormControl(''),
      serviceTypeId: new FormControl(''),
      downPayment: new FormControl('0'),
      discountType: new FormControl(null),
      allowDiscountAmount: new FormControl('0'),
      allowDiscountPer: new FormControl(null),
      transDate: new FormControl(moment(new Date()).format("DD-MM-yyyy")),
      allowDiscountDefault: new FormControl(null)
    })
    this.parentForm.setControl('addServiceForm', this.addServiceForm);
  }
  initPopUpModal() {
    this.popUpForm = this.fb.group({
      transactionId: new FormControl(null),
      attachId: new FormControl(null),
      pfid:new FormControl(null)
    })
  }

  initializeFinancialForm() {
    this.financialCalculationForm = this.fb.group({
      noOfTransactions: new FormControl('0'),
      subscriptionPaidAmount: new FormControl('0.0'),
      subscriptionDueAmount: new FormControl('0.0'),
      subscriptionInstalmentAmount: new FormControl('0.0'),
      financialAid: new FormControl('0.0'),
      pfFundRevenue: new FormControl('0.0'),
      adjustmentAmount: new FormControl('0.0'),
      adjustmentAmountRemarks: new FormControl(null),
      pfFundRevenuePercentage: new FormControl('0.0'),
      sponsorLoanPendingAmount: new FormControl('0.0'),
      sponsorDueAmount: new FormControl('0.0'),
      finAidAmountRemarks: new FormControl(null),
      loanPendingAmount: new FormControl('0.0'),
      loanreceivedAmount: new FormControl('0.0'),
      loanInstallmentAmount: new FormControl('0.0'),
      noOfSponsor: new FormControl('0'),
      yearOfService: new FormControl(null),
      totalAmount: new FormControl('0.0'),
      financialAidAmount: new FormControl('0.0'),
      UpdateToDate: new FormControl(null),
      mySeq: new FormControl(1),
      DisplayPERIOD_CODE: new FormControl('20230214'),
      amountMinus: new FormControl('0.0'),
      amountPlus: new FormControl('0.0'),
      systemRemarks: new FormControl(''),
    });
  }

  initializeCashierInformationForm() {
    this.cashierInformationForm = this.fb.group({
      payPer1: new FormControl('0'),
      draftNumber1: new FormControl('0'),
      draftDate1: new FormControl(null),
      draftAmount1: new FormControl('0'),
      bankAccount1: new FormControl('0'),
      deliveryDate1: new FormControl(null),
      receivedBy1: new FormControl(null),
      deliveredBy1: new FormControl(null),
      payPer2: new FormControl('0'),
      draftNumber2: new FormControl('0'),
      draftDate2: new FormControl(null),
      draftAmount2: new FormControl('0'),
      bankAccount2: new FormControl('0'),
      deliveryDate2: new FormControl(null),
      receivedBy2: new FormControl(null),
      deliveredBy2: new FormControl(null),
    })
  }



  saveFinancialService() {
    this.isFormSubmitted = true;
    debugger;
    console.log(this.addServiceFrm.serviceType.errors?.required);
    this.setValidators(this.notSubscriber);
    // Get Tenant Id
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);
    const username = data.map((obj: { username: any; }) => obj.username);
    const periodCode = data.map((obj: { periodCode: any; }) => obj.periodCode);
    const prevPeriodCode = data.map((obj: { prevPeriodCode: any; }) => obj.prevPeriodCode);
    const nextPeriodCode = data.map((obj: { nextPeriodCode: any; }) => obj.nextPeriodCode);
    //console.log(this.common.ifEmployeeExists);
    // NO Need TO Use if we are in edit mode.
    if (!this.mytransid) {
      this.addServiceForm.patchValue({
        serviceType: this.selectedServiceTypeText,
        serviceSubType: this.selectedServiceSubTypeText,
        serviceTypeId: this.selectedServiceType,
        serviceSubTypeId: this.selectedServiceSubType
      })
    }

    let formData = {
      ...this.parentForm.value.addServiceForm,
      ...this.parentForm.value.approvalDetailsForm,
      ...this.parentForm.value.employeeForm,
      ...this.parentForm.value.financialForm,
      ...this.financialCalculationForm.value,
      //...this.parentForm.value.financialFormArray,
      tenentID: tenantId, cruP_ID: 0, locationID: locationId, userId: username,
      periodCode:periodCode,prevPeriodCode:prevPeriodCode,nextPeriodCode:nextPeriodCode
    }

    formData['installmentsBegDate'] = moment(formData['installmentsBegDate']).format("yyyy-MM-DD");
    formData['untilMonth'] = moment(formData['untilMonth']).format("yyyy-MM-DD");
    formData['deliveryDate'] = moment(formData['deliveryDate']).format("yyyy-MM-DD");
    formData['transDate'] = moment(formData['transDate']).format("yyyy-MM-DD");//2023-03-01
    formData['discountType'] = this.allowedDiscountType;
    formData['eachInstallmentsAmt'] = this.addServiceForm.get('installmentAmount')?.value;
    formData['downPayment'] = this.addServiceForm.get('downPayment')?.value;
    formData['allowDiscountAmount'] = this.addServiceForm.get('allowDiscountAmount')?.value;
    formData['installmentAmount'] = this.addServiceForm.get('installmentAmount')?.value;
    formData['totinstallments'] = this.addServiceForm.get('totinstallments')?.value;
    // To get the values of disabled controls. If we are in Edit mode. 
    if (this.mytransid) {
      formData['allowDiscountAmount'] = this.addServiceForm.get('allowDiscountAmount')?.value;
      formData['installmentAmount'] = this.addServiceForm.get('installmentAmount')?.value;
    }
    let finalformData = new FormData();
    Object.keys(formData).forEach(key => finalformData.append(key, formData[key]));
    // finalformData.append('personalPhotoDocType', this.parentForm.value.documentAttachmentForm[0].docType);
    // finalformData.append('personalPhotoDocument', this.parentForm.value.documentAttachmentForm[0].Document);
    // finalformData.append('appplicationFileDocType', this.parentForm.value.documentAttachmentForm[1].docType);
    // finalformData.append('appplicationFileDocument', this.parentForm.value.documentAttachmentForm[1].Document);
    // finalformData.append('workIdDocType', this.parentForm.value.documentAttachmentForm[2].docType);
    // finalformData.append('workIdDocument', this.parentForm.value.documentAttachmentForm[2].Document);
    // finalformData.append('civilIdDocType', this.parentForm.value.documentAttachmentForm[3].docType);
    // finalformData.append('civilIdDocument', this.parentForm.value.documentAttachmentForm[3].Document);
    // finalformData.append('salaryDataDocType', this.parentForm.value.documentAttachmentForm[4].docType);
    // finalformData.append('salaryDataDocument', this.parentForm.value.documentAttachmentForm[4].Document);
    // //
    // finalformData.append('subject', this.parentForm.value.documentAttachmentForm[0].subject);

    // finalformData.append('metaTags', JSON.parse(JSON.stringify(this.parentForm.value.documentAttachmentForm[0].metaTag)));
    // finalformData.append('attachmentRemarks', this.parentForm.value.documentAttachmentForm[0].attachmentRemarks);
    //
    
    //
    if (this.mytransid) {
      //console.log('edit click',formData);
      this.financialService.UpdateFinancialService(finalformData).subscribe((response: any) => {
        if (response.isSuccess == false) {
          this.toastrService.error(response.message, 'Error');
        } else {
          this.toastrService.success('Updated successfully', 'Success');
          setTimeout(() => {
            this.onOkayClick();
          }, 2000);
        }
      })
    } else {
      //console.log('add click',formData);
      this.financialService.AddFinacialService(finalformData).subscribe((response: any) => {
        if (response.isSuccess == false) {
          this.toastrService.error(response.message, 'Error');
        }
        else {
          this.toastrService.success(response.message, 'Success');
          this.searchForm.controls['pfId'].setValue(response.pfId)
          // console.log('save response',response)
          this.popUpForm.patchValue({
            transactionId: response.transactionId,
            attachId: response.attachId,
            pfid: response.pfId,
          })
          this.parentForm.reset();
          this.financialCalculationForm.reset();
          this.openPopUpModal(this.popupModal);
        }
        //this.saveFinancialArray();   
      })
    }

  }

  saveFinancialArray() {
    this.financialService.saveCOA(this.parentForm.value.financialFormArray, {}).subscribe(() => {
      this.toastrService.success('Saved successfully', 'Success');
      this.parentForm.reset();
    })
  }
  cancelClick() {
    // Clear search form 
    this.searchForm.reset();
    // Clear search form 
    this.parentForm.reset();
    this.financialCalculationForm.reset();
   
    // Setting current date to trans date...    
    this.addServiceForm.get('transDate')?.setValue(moment(new Date()).format("yyyy-MM-DD"));
    // Clear serviceTypeSelected
    this.selectServiceType = [];
    this.selectServiceSubType = [];
  }
  calculateUntilMonth(selectedDate: Date) {
    if (selectedDate !== undefined) {
      let noOfinstallments = this.addServiceForm.get('totinstallments')?.value;
      var newDate = moment(selectedDate).add(noOfinstallments - 1, 'M').format('MMM-YYYY');
      this.addServiceForm.patchValue({
        untilMonth: newDate
      });
    }

  }

  // Calculate Installments based on Installment Months...allowDiscountAmount
  calculateInstallments() {
    //
    let amount = this.addServiceForm.get('totamt')?.value;
    let noOfinstallments = this.addServiceForm.get('totinstallments')?.value;
    let allowDiscountAmount = this.addServiceForm.get('allowDiscountAmount')?.value;
    let downPayment = this.addServiceForm.get('downPayment')?.value;
    let allowDiscountDefault = this.addServiceForm.get('allowDiscountDefault')?.value;
    //
    let calculatedAmount = 0;
    let netAmount = 0;
    //
    if (amount == 0 || amount == '') {
      this.toastrService.error('Please enter amount', 'Error');
    }
    else if (noOfinstallments == '' && this.addServiceForm.get('discountType')?.value === 1 && this.selectedServiceSubType != 1) {
      this.toastrService.error('Please enter installments', 'Error');
    } else {
      // If 1 Percentage...
      if (allowDiscountDefault && this.addServiceForm.get('discountType')?.value === 1) {
        calculatedAmount = ((amount - allowDiscountAmount) - downPayment);
        netAmount = (calculatedAmount / noOfinstallments);
        this.addServiceForm.patchValue({
          installmentAmount: netAmount.toFixed(2)
        })
      }
      if (!allowDiscountDefault) {
        this.addServiceForm.patchValue({
          installmentAmount: this.addServiceForm.get('totamt')?.value,
          totinstallments: 0,
          allowDiscountAmount: 0
        })
      }
      // If 2 Fixed Amount and discount will be 100%...
      // else if (this.addServiceForm.get('discountType')?.value === 2) {
      //   calculatedAmount = ((amount - allowDiscountAmount) - downPayment);
      //   netAmount = (calculatedAmount / noOfinstallments);
      // }

      // this.addServiceForm.patchValue({
      //   installmentAmount: netAmount.toFixed(2)
      // })
    }
  }

  onServiceTypeChange(event: any) {
    this.commonService.GetSubServiceTypeByServiceType(21, event.refId).subscribe((response: any) => {
      this.selectServiceSubType = response
      if (this.common.PFId != null
        && this.common.subscribedDate != null
        && this.common.terminationDate != null) {
        // This is Resubscribe Case
        if (response) {
          let index = this.selectServiceSubType.findIndex(x => x.refId == 1);
          if (index >= 0) {
            this.selectServiceSubType.splice(index, 1);
          }
        }
        //
        this.notSubscriber = false;
      }
      if (this.isSubscriber) {
        let index = this.selectServiceSubType.findIndex(x => x.refId == 2);
        if (index >= 0) {
          this.selectServiceSubType.splice(index, 2);
        }
        //
        this.notSubscriber = false;
      }
    });


    this.selectedServiceType = event.refId;
    this.selectedServiceTypeText = event.shortname;
  }

  onServiceSubTypeChange($event: any) {
    this.financialService.GetSelectedServiceSubType(this.selectedServiceType, $event.refId, 21).subscribe((response: any) => {
      // To set discount type and we will save it into TransactionHD...
      this.allowedDiscountType = response.discountType;
      this.addServiceForm.get('downPayment')?.enable();
      this.parentForm.patchValue({
        addServiceForm: {
          allowDiscount: response.allowDiscountAmount,
          allowDiscountPer: response.allowDiscountPer,
          discountType: response.discountType,
          totinstallments: response.maxInstallment,
          allowDiscountAmount: response.allowDiscountAmount,
          allowDiscountDefault: response.allowDiscountDefault
        },
        approvalDetailsForm: {
          serApproval1: +response.serApproval1,
          approvalBy1: response.approvalBy1,
          approvedDate1: response.approvedDate1 ? new Date(response.approvedDate1) : '',

          serApproval2: +response.serApproval2,
          approvalBy2: response.approvalBy2,
          approvedDate2: response.approvedDate2 ? new Date(response.approvedDate2) : '',

          serApproval3: +response.serApproval3,
          approvalBy3: response.approvalBy3,
          approvedDate3: response.approvedDate3 ? new Date(response.approvedDate3) : '',

          serApproval4: +response.serApproval4,
          approvalBy4: response.approvalBy4,
          approvedDate4: response.approvedDate4 ? new Date(response.approvedDate4) : '',

          serApproval5: +response.serApproval5,
          approvalBy5: response.approvalBy5,
          approvedDate5: response.approvedDate5 ? new Date(response.approvedDate5) : '',
        },
        financialForm: {
          loanAct: response.loanAct,
          hajjAct: response.hajjAct,
          persLoanAct: response.persLoanAct,
          consumerLoanAct: response.consumerLoanAct,
          otherAct1: response.otherAct1,
          otherAct2: response.otherAct2,
          otherAct3: response.otherAct3,
          otherAct4: response.otherAct4,
          otherAct5: response.otherAct5
        },
      });
      if (!this.addServiceForm.get('allowDiscountDefault')?.value) {
        this.addServiceForm.patchValue({
          installmentAmount: this.addServiceForm.get('totamt')?.value,
          totinstallments: 0,
          allowDiscountAmount: 0
        })
        //
        this.enableDisableControls(this.addServiceForm.get('allowDiscountDefault')?.value)
      }
      // To add default current date...
      var now = new Date();
      console.log(this.addServiceForm.get('transDate')?.value);
      this.addServiceForm.patchValue({
        installmentsBegDate: moment(new Date(now.getFullYear(),now.getMonth()+1)).format("MMM-YYYY"),
        untilMonth: moment(new Date(now.getFullYear(),now.getMonth()+1)).format("MMM-YYYY"),
        transDate:moment(new Date()).format("yyyy-MM-DD")
      })
      // To enable/disable PF Id text box.
      if (this.isPfIdExists) {
        this.addServiceForm.get('pfId')?.disable();
      }
      if ($event.refId == 1) {
        this.addServiceForm.patchValue({
          allowDiscountAmount: 0
        })
      }
      if (this.selectedServiceType == 2 && $event.refId == 3) {
        this.parentForm.patchValue({
          addServiceForm: {
            allowDiscountAmount: 100
          }
        });
        //
        this.addServiceForm.get('downPayment')?.disable();
      }
    })
    this.selectedServiceSubType = $event.refId;
    this.selectedServiceSubTypeText = $event.shortName;
  }

  // To access form controls...
  get addServiceFrm() { return this.addServiceForm.controls; }
  // Conditionally set validations.
  setValidators(isNotSubscriber: boolean) {
    const totamt = this.addServiceForm.get('totamt');
    const totinstallments = this.addServiceForm.get('totinstallments');
    const installmentAmount = this.addServiceForm.get('installmentAmount');
    const allowDiscount = this.addServiceForm.get('allowDiscount');
    const installmentsBegDate = this.addServiceForm.get('installmentsBegDate');

    const serviceType = this.addServiceForm.get('serviceType');
    const serviceSubType = this.addServiceForm.get('serviceSubType');
    if (isNotSubscriber) {
      totamt?.setValidators([Validators.required]);
      totinstallments?.setValidators([Validators.required]);
      installmentAmount?.setValidators([Validators.required]);
      allowDiscount?.setValidators([Validators.required]);
      installmentsBegDate?.setValidators([Validators.required]);
      serviceType?.setValidators([Validators.required]);
      serviceSubType?.setValidators([Validators.required]);
    }
    if (!isNotSubscriber) {
      totamt?.setValidators(null);
      totinstallments?.setValidators(null);
      installmentAmount?.setValidators(null);
      allowDiscount?.setValidators(null);
      installmentsBegDate?.setValidators(null);
      serviceType?.setValidators(null);
      serviceSubType?.setValidators(null);
    }
    totamt?.updateValueAndValidity();
    totinstallments?.updateValueAndValidity();
    installmentAmount?.updateValueAndValidity();
    allowDiscount?.updateValueAndValidity();
    installmentsBegDate?.updateValueAndValidity();
    serviceType?.updateValueAndValidity();
    serviceSubType?.updateValueAndValidity();
  }
  //#region Delete operation and Modal Config
  openPopUpModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.onOkayClick();
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

  failResponse:any;
  SearchEmployee() {
    console.log(this.searchForm.value);
    if(this.searchForm.value['employeeId']==null){
      this.searchForm.value['employeeId'] = 0;
    }
    this.selectServiceType = [];
    this.selectServiceSubType = [];
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);

    // To hide/show the financial calculation div
    this.isPFIdNull = false;
    this.isSearched = false;
    this.financialService.SearchEmployee(this.searchForm.value).subscribe((response: any) => {
      if (response.isSuccess == false) {
        this.failResponse = response;   
        this.common.ifEmployeeExists = false;
        this.toastrService.error(response.message, 'Error');
        this.employeeForm?.reset();             
      }
      else {
        // To display other Accordians
        this.isSearched = true;
        this.common.ifEmployeeExists = true;
        // To check if Pf Id is already exists so will disable the control.
        if (response.pfid) {
          this.isPfIdExists = true;
        }
        this.employeeForm?.patchValue({
          employeeId: response.employeeId,
          englishName: response.englishName,
          arabicName: response.arabicName,
          empGender: response.empGender,
          joinedDate: moment(response.joinedDate).format("DD-MM-yyyy"),
          empBirthday: new Date(response.empBirthday),
          mobileNumber: response.mobileNumber,
          empMaritalStatus: +response.empMaritalStatus,
          nationName: response.nationName,
          contractType: +response.contractType,
          subscriptionAmount: response.subscriptionAmount,
          subscriptionPaid: response.subscriptionPaid,
          lastSubscriptionPaid: response.lastSubscriptionPaid,
          subscriptionDueAmount: response.subscriptionDueAmount,
          subscriptionStatus: response.subscriptionStatus,
          terminationDate: response.terminationDate ? moment(response.terminationDate).format("DD-MM-yyyy") : '',
          endDate: response.endDate ? moment(response.endDate).format("DD-MM-yyyy") :  '',
          employeeStatus: response.employeeStatus,
          isKUEmployee: response.isKUEmployee,
          isOnSickLeave: response.isOnSickLeave,
          isMemberOfFund: response.isMemberOfFund,
          CountryNameEnglish: response.countryNameEnglish,
          CountryNameArabic: response.countryNameArabic,
          employeePFId: response.pfid,
          employeeCID: response.empCidNum,
          employeeFormEmployeeId: response.employeeId,
          salary: response.salary,
          kinMobile:response.next2KinMobNumber,
          kinName:response.next2KinName,
        })
        this.addServiceForm.patchValue({
          pfId: response.pfid
        })
        this.common.PFId = response.pfid;
        this.common.subscribedDate = response.subscribedDate;
        this.common.terminationDate = response.terminationDate;
        // fill service type dropdown according to searched employee Id
        this.notSubscriber = false;
        this.financialService.GetServiceType(tenantId).subscribe((response: any) => {
          this.pfId = this.common.PFId;
          this.selectServiceType = response;
          if (this.common.PFId != null
            && this.common.subscribedDate == null
            && this.common.terminationDate == null) {
            // remove subscribe from servicetype & Subtype
            //if (result.trim()) {
            let index = this.selectServiceType.findIndex(x => x.refId == 1);
            if (index >= 0) {
              this.selectServiceType.splice(index, 1);
            }
            //}
            this.notSubscriber = true;
          } else if (this.common.PFId == null
            && this.common.subscribedDate == null
            && this.common.terminationDate == null) {
            this.selectServiceType = response;
            let arr = this.selectServiceType.filter(x => x.refId == 1)
            this.selectServiceType = arr;
            this.isSubscriber = true;
          }
        });
        this.employeeForm?.get('contractType')?.disable();
      }
    }, error => {
      if (error.status === 500) {
        this.toastrService.error('Please enter Employee Id or CID or PFId', 'Error');
      }
    });
  }
  // 
  SearchSponsor() {
    this.selectServiceType = [];
    this.selectServiceSubType = [];
    //
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);

    // To hide/show the financial calculation div
    this.isPFIdNull = false;
    this.isSearched = false;
    this.financialService.SearchSponsor(this.searchForm.value).subscribe((response: any) => {
      if (response.isSuccess == false) {
        this.common.ifEmployeeExists = false;
        this.toastrService.error(response.message, 'Error');
        this.employeeForm?.reset();
      } else {
        // To display other Accordians
        this.isSearched = true;
        this.common.ifEmployeeExists = true;
        this.employeeForm?.patchValue({
          employeeId: response.employeeId,
          englishName: response.englishName,
          arabicName: response.arabicName,
          empGender: response.empGender,
          joinedDate: moment(response.joinedDate).format("DD-MM-yyyy"),
          empBirthday: new Date(response.empBirthday),
          mobileNumber: response.mobileNumber,
          empMaritalStatus: +response.empMaritalStatus,
          nationName: response.nationName,
          contractType: +response.contractType,
          subscriptionAmount: response.subscriptionAmount,
          subscriptionPaid: response.subscriptionPaid,
          lastSubscriptionPaid: response.lastSubscriptionPaid,
          subscriptionDueAmount: response.subscriptionDueAmount,
          subscriptionStatus: response.subscriptionStatus,
          terminationDate: response.terminationDate ? moment(response.terminationDate).format("DD-MM-yyyy") : '',
          endDate: response.endDate ? moment(response.endDate).format("DD-MM-yyyy") :  '',
          employeeStatus: response.employeeStatus,
          isKUEmployee: response.isKUEmployee,
          isOnSickLeave: response.isOnSickLeave,
          isMemberOfFund: response.isMemberOfFund,
          CountryNameEnglish: response.countryNameEnglish,
          CountryNameArabic: response.countryNameArabic,
          employeePFId: response.pfid,
          employeeCID: response.empCidNum,
          employeeFormEmployeeId: response.employeeId,
          salary: response.salary,
          kinMobile:response.next2KinMobNumber,
          kinName:response.next2KinName,
        })
        this.addServiceForm.patchValue({
          pfId: response.pfid
        })
        this.common.PFId = response.pfid;
        this.common.subscribedDate = response.subscribedDate;
        this.common.terminationDate = response.terminationDate;
        // fill service type dropdown according to searched employee Id
        this.notSubscriber = false;
        this.financialService.GetServiceType(tenantId).subscribe((response: any) => {
          this.pfId = this.common.PFId;
          this.selectServiceType = response;
          
          if (this.common.PFId != null
            && this.common.subscribedDate == null
            && this.common.terminationDate == null) {
            // remove subscribe from servicetype & Subtype
            //if (result.trim()) {
            let index = this.selectServiceType.findIndex(x => x.refId == 1);
            if (index >= 0) {
              this.selectServiceType.splice(index, 1);
            }
            //}
            this.notSubscriber = true;
          } else if (this.common.PFId == null
            && this.common.subscribedDate == null
            && this.common.terminationDate == null) {
            this.selectServiceType = response;
            let arr = this.selectServiceType.filter(x => x.refId == 1)
            this.selectServiceType = arr;
            this.isSubscriber = true;
          }
        });
      }
    }, error => {
      if (error.status === 500) {
        this.toastrService.error('Please enter Employee Id or CID or PFId', 'Error');
      }
    });
  }
  SearchNewSubscriber() {
    // this.selectServiceType=[];
    // this.selectServiceSubType=[];
    //
    // this.employeeForm?.patchValue({
    //   employeeId: this.failResponse.employeeId,
    //   englishName: this.failResponse.englishName,
    //   arabicName: this.failResponse.arabicName,
    //   empGender: this.failResponse.empGender,
    //   joinedDate: moment(this.failResponse.joinedDate).format("DD-MM-yyyy"),
    //   empBirthday: new Date(this.failResponse.empBirthday),
    //   mobileNumber: this.failResponse.mobileNumber,
    //   empMaritalStatus: +this.failResponse.empMaritalStatus,
    //   nationName: this.failResponse.nationName,
    //   contractType: +this.failResponse.contractType,
    //   subscriptionAmount: this.failResponse.subscriptionAmount,
    //   subscriptionPaid: this.failResponse.subscriptionPaid,
    //   lastSubscriptionPaid: this.failResponse.lastSubscriptionPaid,
    //   subscriptionDueAmount: this.failResponse.subscriptionDueAmount,
    //   subscriptionStatus: this.failResponse.subscriptionStatus,
    //   terminationDate: this.failResponse.terminationDate ? moment(this.failResponse.terminationDate).format("DD-MM-yyyy") : '',
    //   endDate: this.failResponse.endDate ? moment(this.failResponse.endDate).format("DD-MM-yyyy") :  '',
    //   employeeStatus: this.failResponse.employeeStatus,
    //   isKUEmployee: this.failResponse.isKUEmployee,
    //   isOnSickLeave: this.failResponse.isOnSickLeave,
    //   isMemberOfFund: this.failResponse.isMemberOfFund,
    //   CountryNameEnglish: this.failResponse.countryNameEnglish,
    //   CountryNameArabic: this.failResponse.countryNameArabic,
    //   employeePFId: this.failResponse.pfid,
    //   employeeCID: this.failResponse.empCidNum,
    //   employeeFormEmployeeId: this.failResponse.employeeId,
    //   salary: this.failResponse.salary,
    //   kinMobile:this.failResponse.next2KinMobNumber,
    //   kinName:this.failResponse.next2KinName,
    // })
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);

    // To hide/show the financial calculation div
    this.isPFIdNull = false;
    this.isSearched = false;
    this.financialService.SearchNewSubscriber(this.searchForm.value).subscribe((response: any) => {
      if (response.isSuccess == false) {
        this.common.ifEmployeeExists = false;
        this.toastrService.error(response.message, 'Error');
        // this.employeeForm?.reset();
      } else {
        // To display other Accordians
        this.isSearched = true;
        this.common.ifEmployeeExists = true;
        console.log('search new subscriber',response);
        this.employeeForm?.patchValue({
          employeeId: response.employeeId,
          englishName: response.englishName,
          arabicName: response.arabicName,
          empGender: response.empGender,
          joinedDate: moment(response.joinedDate).format("DD-MM-yyyy"),
          empBirthday: new Date(response.empBirthday),
          mobileNumber: response.mobileNumber,
          empMaritalStatus: +response.empMaritalStatus,
          nationName: response.nationName,
          contractType: +response.contractType,
          subscriptionAmount: response.subscriptionAmount,
          subscriptionPaid: response.subscriptionPaid,
          lastSubscriptionPaid: response.lastSubscriptionPaid,
          subscriptionDueAmount: response.subscriptionDueAmount,
          subscriptionStatus: response.subscriptionStatus,
          terminationDate: response.terminationDate ? moment(response.terminationDate).format("DD-MM-yyyy") : '',
          endDate: response.endDate ? moment(response.endDate).format("DD-MM-yyyy") :  '',
          employeeStatus: response.employeeStatus,
          isKUEmployee: response.isKUEmployee,
          isOnSickLeave: response.isOnSickLeave,
          isMemberOfFund: response.isMemberOfFund,
          CountryNameEnglish: response.countryNameEnglish,
          CountryNameArabic: response.countryNameArabic,
          employeePFId: response.pfid,
          employeeCID: response.empCidNum,
          employeeFormEmployeeId: response.employeeId,
          salary: response.salary,
          kinMobile:response.next2KinMobNumber,
          kinName:response.next2KinName,
        })
        this.addServiceForm.patchValue({
          pfId: response.pfid
        })
        
        this.common.PFId = response.pfid;
        this.common.subscribedDate = response.subscribedDate;
        this.common.terminationDate = response.terminationDate;
        // fill service type dropdown according to searched employee Id
        this.notSubscriber = false;
        this.financialService.GetServiceType(tenantId).subscribe((response: any) => {
          this.pfId = this.common.PFId;
          this.selectServiceType = response;
          // In case of existing employee/ subscriber...
          if (this.common.PFId != null
            && this.common.subscribedDate == null
            && this.common.terminationDate == null) {
            //
            let index = this.selectServiceType.findIndex(x => x.refId == 1);
            if (index >= 0) {
              this.selectServiceType.splice(index, 1);
            }
            //}
            this.notSubscriber = true;
          } 
          // In case of new subscriber...
          else if (this.common.PFId == null
            && this.common.subscribedDate == null
            && this.common.terminationDate == null) {
            this.selectServiceType = response;
            let arr = this.selectServiceType.filter(x => x.refId == 1)
            this.selectServiceType = arr;
            this.isSubscriber = true;
            let salary = this.employeeForm?.controls['salary'].value;
            let amount = (salary / 100) * 1;
            this.addServiceForm?.get('totamt')?.setValue(amount);
          }

        });
      }
    }, error => {
      if (error.status === 500) {
        this.toastrService.error('Please enter Employee Id or CID or PFId', 'Error');
      }
    });
  }
  getFinancialCalculation() {
    // 
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);
    let transactionDate = moment(this.addServiceForm.get('transDate')?.value).format("yyyy-MM-DD");
    //
    console.log('transaction date', transactionDate);
    if (!this.searchForm.value.employeeId) {
      this.toastrService.error('Employee id not found', 'Error')
    } else if (transactionDate === 'Invalid date') {
      this.toastrService.error('Invalid transaction date', 'Error')
    }
    else if (this.addServiceForm.get('serviceType')?.value === 1) {
      this.toastrService.error('Invalid transaction date', 'Error')
    }
    else if (this.addServiceForm.get('serviceSubType')?.value === 2) {
      this.toastrService.error('Invalid transaction date', 'Error')
    } else {
      this.commonService.GetFinancialCalculationByEmployeeId(this.searchForm.value.employeeId, tenantId, locationId, transactionDate).subscribe((response: any) => {
        this.isPFIdNull = true;
        //
        var total = response.subscriptionPaidAmount - (response.subscriptionDueAmount + response.loanPendingAmount);
        //
        var financialAid = (total / 100) * 1;
        //
        var pfRevenue = (total / 100) * 10;
        //
        var grandTotal = total - (financialAid + pfRevenue);

        this.myTransId = response.myTransId
        this.financialCalculationForm.patchValue({
          noOfTransactions: response.noOfTransactions,
          subscriptionPaidAmount: response.subscriptionPaidAmount.toFixed(2),
          subscriptionDueAmount: response.subscriptionDueAmount.toFixed(2),
          loanAmountBalance: response.balanceOfLoanAmount,
          financialAid: financialAid.toFixed(2),
          pfFundRevenue: pfRevenue.toFixed(2),
          adjustmentAmountRemarks: response.adjustmentAmountRemarks,
          financialAidPercentage: response.financialAidPercentage,
          pfFundRevenuePercentage: response.pfFundRevenuePercentage,
          noOfSponsor: response.noOfSponsor,
          sponsorLoanPendingAmount: response.sponsorLoanPendingAmount,
          financialAidAmountRemarks: response.finAidAmountRemarks,
          yearOfService: response.yearOfService,
          loanPendingAmount: response.loanPendingAmount.toFixed(2),
          totalAmount: grandTotal.toFixed(2),
          amountMinus: response.amountMinus.toFixed(2),
          amountPlus: response.amountPlus.toFixed(2),
          systemRemarks: response.systemRemarks,
        })
      })

    }
  }
  calculateFinancialAmount() {
    var totalAmount = +this.financialCalculationForm.get('totalAmount')?.value;
    var adjustmentAmount = +this.financialCalculationForm.get('adjustmentAmount')?.value;
    var financialAidAmount = +this.financialCalculationForm.get('financialAidAmount')?.value;
    var result = (totalAmount + adjustmentAmount + financialAidAmount);
    this.financialCalculationForm.get('totalAmount')?.setValue(result);
  }
  openCashierInformation(content: any) {
    //
    var data = JSON.parse(localStorage.getItem("user")!);
    const tenantId = data.map((obj: { tenantId: any; }) => obj.tenantId);
    const locationId = data.map((obj: { locationId: any; }) => obj.locationId);

    this.commonService.GetCashierInformationByEmployeeId(this.searchForm.value.employeeId, tenantId, locationId, this.myTransId).subscribe((response: any) => {
      this.cashierInformationForm.patchValue({
        payPer1: response.payPer1,
        draftNumber1: response.draftNumber1,
        draftDate1: moment(response.draftDate1).format("yyyy-MM-DD"),
        draftAmount1: response.draftAmount1,
        bankAccount1: response.bankAccount1,
        deliveryDate1: moment(response.deliveryDate1).format("yyyy-MM-DD"),
        receivedBy1: response.receivedBy1,
        deliveredBy1: response.deliveredBy1,
        payPer2: response.payPer2,
        draftNumber2: response.draftNumber2,
        draftDate2: moment(response.draftDate2).format("yyyy-MM-DD"),
        draftAmount2: response.draftAmount2,
        bankAccount2: response.bankAccount2,
        deliveryDate2: moment(response.deliveryDate2).format("yyyy-MM-DD"),
        receivedBy2: response.receivedBy2,
        deliveredBy2: response.deliveredBy2,
      })
    },
      error => {
        console.log(error);
      })
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  onOkayClick() {
    this.redirectTo(`/service-setup/service-details`);
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  //#region 
  // To enable/disable controls based on AllowDiscountDefault...
  enableDisableControls(isAllowDiscount: boolean) {
    if (isAllowDiscount) {
      this.addServiceForm.get('downPayment')?.enable();
      this.addServiceForm.get('allowDiscountAmount')?.enable();
      this.addServiceForm.get('totinstallments')?.enable();
      this.addServiceForm.get('installmentAmount')?.enable();
      this.addServiceForm.get('installmentsBegDate')?.enable();
      this.addServiceForm.get('untilMonth')?.enable();
      this.addServiceForm.get('serviceType')?.enable();
      this.addServiceForm.get('serviceSubType')?.enable();
    } else {
      this.addServiceForm.get('downPayment')?.disable();
      this.addServiceForm.get('allowDiscountAmount')?.disable();
      this.addServiceForm.get('totinstallments')?.disable();
      this.addServiceForm.get('installmentAmount')?.disable();
      this.addServiceForm.get('installmentsBegDate')?.disable();
      this.addServiceForm.get('untilMonth')?.disable();
      this.addServiceForm.get('serviceType')?.disable();
      this.addServiceForm.get('serviceSubType')?.disable();
    }
    if (this.addServiceForm.get('serviceType')?.value == 1
      || this.addServiceForm.get('serviceSubType')?.value == 2) {
      this.addServiceForm.get('pfId')?.enable()
    }

    if (!this.mytransid) {
      this.addServiceForm.get('serviceType')?.enable();
      this.addServiceForm.get('serviceSubType')?.enable();
    }
  }
  // #endregion

}
