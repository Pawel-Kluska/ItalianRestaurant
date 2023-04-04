import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {InfoComponent} from "./info/info.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  {path: '', component: InfoComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', redirectTo: ''}
]

@NgModule({
  imports: [
  CommonModule,
  RouterModule.forRoot(routes)
],
exports: [ RouterModule ]
})
export class AppRoutingModule { }

