import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceSetupRoutingModule } from './service-setup-routing.module';
import { ServiceSetupDetailsComponent } from './service-setup-details/service-setup-details.component';
import { AddServiceSetupComponent } from './add-service-setup/add-service-setup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddServiceComponent } from './add-service/add-service.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { AddDocumentsComponent } from './add-documents/add-documents.component';
import { ApprovalManagementComponent } from './approval-management/approval-management.component';
import { ImportEmployeeMonthlyPaymentComponent } from './import-employee-monthly-payment/import-employee-monthly-payment.component';
import { EmployeeMovementDetailsComponent } from './employee-moment-details/employee-movement-details.component';
import { AddEmployeeMovementComponent } from './add-employee-moment/add-employee-movement.component';
import { SearchTabModule } from '../_partials/search-tab.module';
import { SharedModule } from '../../_sharedModule/SharedModule';
import { NgxTranslateModule } from '../../i18n';
import { ManageFormLabelsComponent } from '../setup/manage-form-labels/manage-form-labels.component';
import { MaterialModule } from '../../material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentAttachmentComponent } from '../_partials/document-attachment/document-attachment.component';
import { CashierApprovalComponent } from './cashier-approval/cashier-approval.component';
import { FinancialApprovalComponent } from './financial-approval/financial-approval.component';
import { CashierDeliveryComponent } from './cashier-delivery/cashier-delivery.component';
import { CashierDraftComponent } from './cashier-draft/cashier-draft.component';
import { FinancialDraftComponent } from './financial-draft/financial-draft.component';
import { FinancialDeliveryComponent } from './financial-delivery/financial-delivery.component';
import { ViewServiceDetailComponent } from './view-service-detail/view-service-detail.component';
import { VoucherComponent } from './voucher/voucher.component';
import { VoucherDetailsComponent } from './voucher-details/voucher-details.component';
import { GeneralVoucherComponent } from './general-voucher/general-voucher.component';
import {MatMenuModule} from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
// import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    ServiceSetupDetailsComponent,
    AddServiceSetupComponent,
    AddServiceComponent,
    ServiceDetailsComponent,
    AddDocumentsComponent,
    ApprovalManagementComponent,
    ImportEmployeeMonthlyPaymentComponent,
    EmployeeMovementDetailsComponent,
    AddEmployeeMovementComponent,
    CashierApprovalComponent,
    FinancialApprovalComponent,
    CashierDeliveryComponent,
    CashierDraftComponent,
    FinancialDraftComponent,
    FinancialDeliveryComponent,
    ViewServiceDetailComponent,
    VoucherComponent,
    VoucherDetailsComponent,
    GeneralVoucherComponent,
  ],
  imports: [
    CommonModule,
    ServiceSetupRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SearchTabModule,    
    SharedModule,
    // NgxTranslateModule,
    MaterialModule,
    TranslateModule,
    NgSelectModule,
    NgbModule,
    MatMenuModule,
    // MatButtonModule

  ],
  exports:[
    NgSelectModule,
    
  ]
})
export class ServiceSetupModule { }
