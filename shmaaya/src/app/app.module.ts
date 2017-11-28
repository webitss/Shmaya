import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { ContainerComponent } from './container.component';
import { AppDialogComponent } from './dialogbox.component';
import { AlfonComponent } from './Alfon/alfon.component';
import { OrderComponent } from './Orders/order.component';
import { OrderboardComponent } from './Orders/orderboard.component';
import { OrderlistComponent } from './Orders/orderlist.component';
import { CustomersComponent } from './Alfon/customers.component';
import { ServiceproviderComponent } from './Alfon/serviceproviders.component';
import { AdministratorsComponent } from './Alfon/administrators.component';
import { PrivateDetailsComponent } from './EditCustomer/privateDetails.component';
import { RefundsComponent } from './EditCustomer/Refunds.component';
import { SendmessageComponent } from './EditCustomer/sendmessage.component';
import { ConnectionsComponent } from './EditCustomer/connections.component';
import { DocumentationComponent } from './EditCustomer/Documentation.component';
import { RemarksComponent } from './EditCustomer/remarks.component';
import { PrivateDetailsPSComponent } from './EditProviders/privatedetails_ps.components';
import { SendmessagePSComponent } from './EditProviders/sendmessage_ps.component';
import { ConnectionsPSComponent } from './EditProviders/connections_ps.component';
import { DocumentationPSComponent } from './EditProviders/documentation_ps.component';
import { RemarksPSComponent } from './EditProviders/remarks_ps.component';
import { PrivateDetailsAComponent } from './EditAdministrator/privatedetails_a.component';
import { SendmessagesComponent } from './SendMessages/sendmessages.components';
import { PropertiesComponent } from './Properties/properties.component';
import { EligibilityComponent } from './Properties/eligibilityTable.component';
import { CommunicationComponent } from './Properties/communicationBasket.component';
import { PaymentsComponent } from './Properties/payments.component';
import { ProductsComponent } from './Properties/products.component';
import { monthesComponent } from './Properties/monthes.component';
import { ReportsComponent } from './Reports/reports.components';
import { ServiceprovidersRepComponent } from './Reports/serviceproviders_rep.component';
import { ReciveserviceRepComponent } from './Reports/reciveservice_rep.component';
import { ProductsRepComponent } from './Reports/products_rep.component';
import { appService } from './app.service';
import { LoginComponent } from './login.component';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    AppDialogComponent,
    OrderboardComponent,
    OrderlistComponent,
    AlfonComponent,
    ContainerComponent,
    CustomersComponent,
    ServiceproviderComponent,
    AdministratorsComponent,
    PrivateDetailsComponent,
    RefundsComponent,
    SendmessageComponent,
    ConnectionsComponent,
    DocumentationComponent,
    RemarksComponent,
    PrivateDetailsPSComponent,
    SendmessagePSComponent,
    ConnectionsPSComponent,
    DocumentationPSComponent,
    RemarksPSComponent,
    PrivateDetailsAComponent,
    SendmessagesComponent,
    PropertiesComponent,
    EligibilityComponent,
    CommunicationComponent,
    PaymentsComponent,
    ProductsComponent,
    monthesComponent,
    ReportsComponent,
    ServiceprovidersRepComponent,
    ReciveserviceRepComponent,
    ProductsRepComponent,
    LoginComponent,
  
  
    
    
  ],
  imports: [
    BrowserModule, ReactiveFormsModule, FormsModule, 
    RouterModule.forRoot([
      {path:"login",component:LoginComponent},
      {path:"container",component:ContainerComponent},
      {path:"order",component:OrderComponent,children:[
        {path:"orderboard",component:OrderboardComponent},
      {path:"orderlist",component:OrderlistComponent}]},
      
      {path:"alfon",component:AlfonComponent,children:[
        {path:"customers",component:CustomersComponent,children:
      [
        {path:"privatedetails",component:PrivateDetailsComponent},
        {path:"refunds",component:RefundsComponent},
        {path:"sendmessage",component:SendmessageComponent},
        {path:"connections",component:ConnectionsComponent},
        {path:"documentation",component:DocumentationComponent},
        {path:"remarks",component:RemarksComponent},
      ]},
        {path:"serviceprovider",component:ServiceproviderComponent,children:[
          {path:"privatedetails_ps",component:PrivateDetailsPSComponent},
          {path:"sendmessage_ps",component:SendmessagePSComponent},
          {path:"connections_ps",component:ConnectionsPSComponent},
          {path:"documentation_ps",component:DocumentationPSComponent},
          {path:"remarks_ps",component:RemarksPSComponent},
        ]},
        {path:"administrators",component:AdministratorsComponent},
        {path:"privatedetails",component:PrivateDetailsComponent}
      ]},
      {path:"sendmessages",component:SendmessagesComponent},
      {path:"properties",component:PropertiesComponent,children:[
        {path:"eligibility",component:EligibilityComponent},
        {path:"communication",component:CommunicationComponent}, 
        {path:"payments",component:PaymentsComponent}, 
        {path:"products",component:ProductsComponent},  
        {path:"monthes",component:monthesComponent}, 
      ]},
      {path:"reports",component:ReportsComponent,children:[
        {path:"serviceproviders_rep",component:ServiceprovidersRepComponent},
        {path:"reciveservice_rep",component:ReciveserviceRepComponent},
        {path:"products_rep",component:ProductsRepComponent}
      ]}
    ])],
  providers: [appService],
  bootstrap: [AppComponent]
})
export class AppModule { }

