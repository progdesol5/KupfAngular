import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDocumentsComponent } from './add-documents/add-documents.component';
import { AddEmployeeMovementComponent } from './add-employee-moment/add-employee-movement.component';
import { AddServiceSetupComponent } from './add-service-setup/add-service-setup.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ApprovalManagementComponent } from './approval-management/approval-management.component';
import { EmployeeMovementDetailsComponent } from './employee-moment-details/employee-movement-details.component';
import { ImportEmployeeMonthlyPaymentComponent } from './import-employee-monthly-payment/import-employee-monthly-payment.component';
import { ManageFormLabelsComponent } from '../setup/manage-form-labels/manage-form-labels.component';


import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceSetupDetailsComponent } from './service-setup-details/service-setup-details.component';
import { CashierApprovalComponent } from './cashier-approval/cashier-approval.component';
import { FinancialApprovalComponent } from './financial-approval/financial-approval.component';
import { CashierDeliveryComponent } from './cashier-delivery/cashier-delivery.component';
import { CashierDraftComponent } from './cashier-draft/cashier-draft.component';
import { FinancialDeliveryComponent } from './financial-delivery/financial-delivery.component';
import { FinancialDraftComponent } from './financial-draft/financial-draft.component';
import { ViewServiceDetailComponent } from './view-service-detail/view-service-detail.component';
import { VoucherComponent } from './voucher/voucher.component';
import { VoucherDetailsComponent } from './voucher-details/voucher-details.component';
import { GeneralVoucherComponent } from './general-voucher/general-voucher.component';

const routes: Routes = [
  { path: 'service-setup-details', component: ServiceSetupDetailsComponent },
  { path: 'add-service-setup', component: AddServiceSetupComponent },
  { path: 'add-service-setup/:serviceId', component: AddServiceSetupComponent },
  { path: 'add-service', component: AddServiceComponent },
  { path: 'add-service/:mytransid', component: AddServiceComponent },
  { path: 'service-details', component: ServiceDetailsComponent },
  { path: 'add-documents', component: AddDocumentsComponent },
  { path: 'manage-approvals', component: ApprovalManagementComponent },
  { path: 'import-emplyee-monthly-payment', component: ImportEmployeeMonthlyPaymentComponent },
  { path: 'add-employee-movement', component: AddEmployeeMovementComponent },
  { path: 'employee-movement-details', component: EmployeeMovementDetailsComponent },  
  { path: 'cashier-approval', component: CashierApprovalComponent }, 
  { path: 'financial-approval', component: FinancialApprovalComponent },
  { path: 'cashier-delivery', component: CashierDeliveryComponent },
  { path: 'cashier-draft', component: CashierDraftComponent },
  { path: 'financial-delivery', component: FinancialDeliveryComponent },
  { path: 'financial-draft', component: FinancialDraftComponent },
  {path: 'view-service-detail/:transId',component:ViewServiceDetailComponent},
  {path: 'voucher',component:VoucherComponent},
  {path: 'voucher-details/:voucherId',component:VoucherDetailsComponent},
  {path: 'general-voucher',component:GeneralVoucherComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceSetupRoutingModule { }
