import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { LogovanjeComponent } from './logovanje/logovanje.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegpoljComponent } from './regpolj/regpolj.component';
import { RegprivrComponent } from './regprivr/regprivr.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { MatRippleModule } from '@angular/material/core';
import { DialogSadniceComponent } from './dialog-sadnice/dialog-sadnice.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { PropredComponent } from './propred/propred.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    RegistracijaComponent,
    LogovanjeComponent,
    PocetnaComponent,
    RegpoljComponent,
    RegprivrComponent,
    AdminComponent,
    PoljoprivrednikComponent,
    PreduzeceComponent,
    DialogSadniceComponent,
    PropredComponent
  ],
  entryComponents: [DialogSadniceComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    RecaptchaModule,
    MatSnackBarModule,
    HttpClientModule,
    MatTableModule,
    MatMenuModule,
    MatExpansionModule,
    MatDialogModule,
    MatRippleModule,
    MatProgressBarModule,
    MatSortModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatStepperModule,
    ChartsModule
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'hr',
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
