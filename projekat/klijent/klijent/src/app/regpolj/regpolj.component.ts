import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgroservisService } from '../agroservis.service';
import { Pojloprivrednik } from '../interfejsi/poljoprivrednik';

@Component({
  selector: 'app-regpolj',
  templateUrl: './regpolj.component.html',
  styleUrls: ['./regpolj.component.css']
})
export class RegpoljComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private servis: AgroservisService) { }

  recaptcha: any;

  ime: string;
  prezime: string;
  korIme: string;
  lozinka: string;
  rodjendan: Date;
  mesto: string;
  telefon: string;
  email: string;

  ngOnInit(): void {
  }

  resolved(CaptchaResponse: any) {
    this.recaptcha = CaptchaResponse;
    console.log(this.recaptcha);
  }

  prijava() {
    if (this.ime == "" || this.prezime == "" || this.korIme == "" || this.lozinka == "" || this.mesto == "" || this.telefon == "" || this.email == "" || !(this.provera(this.rodjendan))
      || this.ime == null || this.prezime == null || this.korIme == null || this.lozinka == null || this.mesto == null || this.telefon == null || this.email == null || !(grecaptcha && grecaptcha.getResponse().length > 0)) {
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
        let godina = JSON.stringify(this.rodjendan.getFullYear());
        let mesec = JSON.stringify(this.rodjendan.getMonth() + 1);
        let dan = JSON.stringify(this.rodjendan.getDate());
        let s = godina + "-" + mesec + "-" + dan;
        let p: Pojloprivrednik = { ime: this.ime, prezime: this.prezime, korIme: this.korIme, lozinka: this.lozinka, rodjendan: s, mesto: this.mesto, telefon: this.telefon, email: this.email, prihvacen: 0 };
        this.servis.dodajPoljoprivrednika(p).subscribe(data => {
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
