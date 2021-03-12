import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { LogovanjeComponent } from './logovanje/logovanje.component';
import { RegpoljComponent } from './regpolj/regpolj.component';
import { RegprivrComponent } from './regprivr/regprivr.component';
import { AdminComponent } from './admin/admin.component';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { PropredComponent } from './propred/propred.component';


const routes: Routes = [
  { path: '', component: PocetnaComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'logovanje', component: LogovanjeComponent },
  { path: 'regpolj', component: RegpoljComponent },
  { path: 'regprivr', component: RegprivrComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'poljoprivrednik', component: PoljoprivrednikComponent },
  { path: 'preduzece', component: PreduzeceComponent },
  { path: 'proizvod/:id', component: PropredComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
