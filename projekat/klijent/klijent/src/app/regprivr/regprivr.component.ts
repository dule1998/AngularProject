import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Preduzece } from '../interfejsi/preduzece';
import { AgroservisService } from '../agroservis.service';

@Component({
  selector: 'app-regprivr',
  templateUrl: './regprivr.component.html',
  styleUrls: ['./regprivr.component.css']
})
export class RegprivrComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private servis: AgroservisService) { }

  recaptcha: any;

  imePred: string;
  skr: string;
  lozinka: string;
  datumOsn: Date;
  mesto: string;
  email: string;

  ngOnInit(): void {
  }

  resolved(CaptchaResponse: any) {
    this.recaptcha = CaptchaResponse;
    console.log(this.recaptcha);
  }

  prijava() {
    if (this.imePred == "" || this.skr == "" || this.lozinka == "" || this.mesto == "" || this.email == "" || !(this.provera(this.datumOsn))
      || this.imePred == null || this.skr == null || this.lozinka == null || this.mesto == null || this.email == null || !(grecaptcha && grecaptcha.getResponse().length > 0)) {
      this.openSnackBar("Pogrešno uneti podaci", "Izađi");
    } else {
      let regExp1 = /.{7,}/;
      let regExp2 = /[A-Z]/;
      let regExp3 = /[a-z]/;
      let regExp4 = /\d/;
      let regExp5 = /\W/;
      let regExp6 = /^([a-z]|[A-Z])/;

      if (regExp1.test(this.lozinka) && regExp2.test(this.lozinka) && regExp3.test(this.lozinka)
        && regExp4.test(this.lozinka) && regExp5.test(this.lozinka) && regExp6.test(this.lozinka)) {
        let godina = JSON.stringify(this.datumOsn.getFullYear());
        let mesec = JSON.stringify(this.datumOsn.getMonth() + 1);
        let dan = JSON.stringify(this.datumOsn.getDate());
        let s = godina + "-" + mesec + "-" + dan;
        let p: Preduzece = { imePred: this.imePred, skr: this.skr, lozinka: this.lozinka, datumOsn: s, mesto: this.mesto, email: this.email, prihvacen: 0 };
        this.servis.dodajPreduzece(p).subscribe(data => {
          if (data == null) {
            this.openSnackBar("Proverite korisničko ime i email", "OK");
          } else {
            this.openSnackBar("Uspešno ste podneli zahtev za prijavu", "OK");
          }
        });
      } else {
        this.openSnackBar("Pogrešno uneti podaci", "OK");
      }
    }
  }

  provera(d: Date): boolean {
    if (Object.prototype.toString.call(d) === "[object Date]") {
      return true;
    } else {
      return false;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
