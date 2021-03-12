import { Component, OnInit, ViewChild } from '@angular/core';
import { Korisnik } from '../interfejsi/korisnik';
import { AgroservisService } from '../agroservis.service';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { Pojloprivrednik } from '../interfejsi/poljoprivrednik';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Preduzece } from '../interfejsi/preduzece';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private servis: AgroservisService, private router: Router, private _snackBar: MatSnackBar) { }

  korisnici: Korisnik[] = [];
  fullKorisnici: Korisnik[] = [];
  prikaz: number = 1;
  prikaz1: number = 0;

  ime: string;
  prezime: string;
  korIme: string;
  lozinka1: string;
  rodjendan: Date;
  mesto1: string;
  telefon: string;
  email1: string;

  imePred: string;
  skr: string;
  lozinka2: string;
  datumOsn: Date;
  mesto2: string;
  email2: string;

  azrime: string;
  azrprezime: string;
  azrkorIme: string;
  azrlozinka1: string;
  azrrodjendan: Date;
  azrmesto1: string;
  azrtelefon: string;
  azremail1: string;

  azrimePred: string;
  azrskr: string;
  azrlozinka2: string;
  azrdatumOsn: Date;
  azrmesto2: string;
  azremail2: string;

  azrusername: string;
  azrlozinka3: string;
  azremail3: string;

  strloz: string;
  novloz: string;
  novloz2: string;

  @ViewChild(MatTable) tabela: MatTable<Korisnik>;

  kolone: string[] = ["rednibr", "username", "password", "obrisi", "potvrdi"];

  ngOnInit(): void {
    if (localStorage.getItem("tip") == "Admin") {
      this.servis.dohvKorisnike().subscribe(data => {
        let b: boolean = true;
        let b1: boolean = true;
        data.forEach(element => {
          if (localStorage.getItem("username") != element.Username) {
            let dat: string = element.Datum.slice(0, 10);
            let dann: number = parseInt(dat.slice(8, 10));
            let mesec: number = parseInt(dat.slice(5, 7));
            let godina: number = parseInt(dat.slice(0, 4));
            if (dann == 31) {
              dann = 1;
              if (mesec == 12) {
                mesec = 1;
                godina++;
              } else {
                mesec++;
              }
            } else {
              if (dann == 30 && (mesec == 4 || mesec == 6 || mesec == 9 || mesec == 11)) {
                dann = 1;
                mesec++;
              } else {
                if (dann == 28 && mesec == 2 && (godina % 4 != 0 || godina % 400 == 0)) {
                  dann = 1;
                  mesec++;
                } else {
                  if (dann == 29 && mesec == 2 && godina % 4 == 0 && godina % 400 != 0) {
                    dann = 1;
                    mesec++;
                  } else {
                    dann++;
                  }
                }
              }
            }
            let s: string = godina + "-" + ((mesec < 10) ? "0" : "") + mesec + "-" + ((dann < 10) ? "0" : "") + dann;
            if (element.Prihvacen == 1) {
              if (b) {
                this.fullKorisnici = [{ IdK: element.IdK, Username: element.Username, Password: element.Password, Datum: s, Mesto: element.Mesto, Email: element.Email, Tip: element.Tip, Prihvacen: element.Prihvacen, Ime: element.Ime, Prezime: element.Prezime, Telefon: element.Telefon, ImePred: element.ImePred },];
                b = false;
              } else {
                let k = { IdK: element.IdK, Username: element.Username, Password: element.Password, Datum: s, Mesto: element.Mesto, Email: element.Email, Tip: element.Tip, Prihvacen: element.Prihvacen, Ime: element.Ime, Prezime: element.Prezime, Telefon: element.Telefon, ImePred: element.ImePred };
                this.fullKorisnici.push(k);
              }
            } else {
              if (b1) {
                this.korisnici = [{ IdK: element.IdK, Username: element.Username, Password: element.Password, Datum: s, Mesto: element.Mesto, Email: element.Email, Tip: element.Tip, Prihvacen: element.Prihvacen, Ime: element.Ime, Prezime: element.Prezime, Telefon: element.Telefon, ImePred: element.ImePred },];
                b1 = false;
              } else {
                let k = { IdK: element.IdK, Username: element.Username, Password: element.Password, Datum: s, Mesto: element.Mesto, Email: element.Email, Tip: element.Tip, Prihvacen: element.Prihvacen, Ime: element.Ime, Prezime: element.Prezime, Telefon: element.Telefon, ImePred: element.ImePred };
                this.korisnici.push(element);
              }
            }
          }
        });
      });
    } else {
      this.router.navigate(['/logovanje']);
    }
  }

  obrisi(username: string) {
    let k: Korisnik;
    this.korisnici.forEach((element, index) => {
      if (element.Username == username) {
        this.korisnici.splice(index, 1);
        this.tabela.renderRows();
      }
    });
    this.servis.izbrisiKorisnika(username).subscribe();
  }

  obrisiSkroz(username: string) {
    this.fullKorisnici.forEach((element, index) => {
      if (element.Username == username) {
        this.fullKorisnici.splice(index, 1);
      }
    });
    this.servis.izbrisiKorisnika(username).subscribe();
  }

  potvrdi(username: string) {
    let k: Korisnik = null;
    this.korisnici.forEach((element, index) => {
      if (element.Username == username) {
        element.Prihvacen = 1;
        k = element;
        this.korisnici.splice(index, 1);
        this.tabela.renderRows();
      }
    });
    let b: boolean = true;
    let b1: boolean = true;
    let i: number = 0;
    this.fullKorisnici.forEach((element, index) => {
      if ((k.IdK < element.IdK) && b) {
        this.fullKorisnici.splice(index, 0, k);
        b = false;
        b1 = false;
      }
    });
    if (b1) {
      this.fullKorisnici.push(k);
    }
    this.servis.azurirajKorisnika(k).subscribe();
  }

  regPolj() {
    this.prikaz = 2;
  }

  regPred() {
    this.prikaz = 3;
  }

  tabelaK() {
    this.prikaz = 1;
  }

  listaSvih() {
    this.prikaz = 4;
  }

  prijavaPolj() {
    if (this.ime == "" || this.prezime == "" || this.korIme == "" || this.lozinka1 == "" || this.mesto1 == "" || this.telefon == "" || this.email1 == "" || !(this.provera(this.rodjendan))
      || this.ime == null || this.prezime == null || this.korIme == null || this.lozinka1 == null || this.mesto1 == null || this.telefon == null || this.email1 == null) {
      this.openSnackBar("Pogrešno uneti podaci", "Izađi");
    } else {
      let regExp1 = /.{7,}/;
      let regExp2 = /[A-Z]/;
      let regExp3 = /[a-z]/;
      let regExp4 = /\d/;
      let regExp5 = /\W/;
      let regExp6 = /^([a-z]|[A-Z])/;

      if (regExp1.test(this.lozinka1) && regExp2.test(this.lozinka1) && regExp3.test(this.lozinka1)
        && regExp4.test(this.lozinka1) && regExp5.test(this.lozinka1) && regExp6.test(this.lozinka1)) {
        let godina = JSON.stringify(this.rodjendan.getFullYear());
        let mesec = JSON.stringify(this.rodjendan.getMonth());
        let dan = JSON.stringify(this.rodjendan.getDate());
        let s = godina + "-" + mesec + "-" + dan;
        let p: Pojloprivrednik = { ime: this.ime, prezime: this.prezime, korIme: this.korIme, lozinka: this.lozinka1, rodjendan: s, mesto: this.mesto1, telefon: this.telefon, email: this.email1, prihvacen: 1 };
        this.openSnackBar("Uspešno ste podneli zahtev za prijavu", "Izađi");
        this.servis.dodajPoljoprivrednika(p).subscribe();
      } else {
        this.openSnackBar("Pogrešno uneti podaci", "Izađi");
      }
    }
  }

  prijavaPred() {
    if (this.imePred == "" || this.skr == "" || this.lozinka2 == "" || this.mesto2 == "" || this.email2 == "" || !(this.provera(this.datumOsn))
      || this.imePred == null || this.skr == null || this.lozinka2 == null || this.mesto2 == null || this.email2 == null) {
      this.openSnackBar("Pogrešno uneti podaci", "Izađi");
    } else {
      let regExp1 = /.{7,}/;
      let regExp2 = /[A-Z]/;
      let regExp3 = /[a-z]/;
      let regExp4 = /\d/;
      let regExp5 = /\W/;
      let regExp6 = /^([a-z]|[A-Z])/;

      if (regExp1.test(this.lozinka2) && regExp2.test(this.lozinka2) && regExp3.test(this.lozinka2)
        && regExp4.test(this.lozinka2) && regExp5.test(this.lozinka2) && regExp6.test(this.lozinka2)) {
        let godina = JSON.stringify(this.datumOsn.getFullYear());
        let mesec = JSON.stringify(this.datumOsn.getMonth());
        let dan = JSON.stringify(this.datumOsn.getDate());
        let s = godina + "-" + mesec + "-" + dan;
        let p: Preduzece = { imePred: this.imePred, skr: this.skr, lozinka: this.lozinka2, datumOsn: s, mesto: this.mesto2, email: this.email2, prihvacen: 1 };
        this.openSnackBar("Uspešno ste podneli zahtev za prijavu", "Izađi");
        this.servis.dodajPreduzece(p).subscribe();
      } else {
        this.openSnackBar("Pogrešno uneti podaci", "Izađi");
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

  openDialog(kor: Korisnik) {
    this.prikaz1 = 1 - this.prikaz1;
  }

  potvrda(kor: Korisnik) {
    if (kor.Tip == "Admin") {
      if (this.azrusername != null && this.azrusername != "") {
        kor.Username == this.azrusername;
      }
      if (this.azrlozinka3 != null && this.azrlozinka3 != "") {
        kor.Password = this.azrlozinka3;
      }
      this.servis.azurirajAdmina(kor).subscribe();
    } else {
      if (kor.Tip == "Poljoprivrednik") {
        if (this.azrkorIme != null && this.azrkorIme != "") {
          kor.Username == this.azrusername;
        }
        if (this.azrlozinka1 != null && this.azrlozinka1 != "") {
          kor.Password = this.azrlozinka3;
        }
        if (this.azrime != null && this.azrime != "") {
          kor.Ime == this.azrime;
        }
        if (this.azrprezime != null && this.azrprezime != "") {
          kor.Prezime == this.azrprezime;
        }
        if (this.provera(this.azrrodjendan)) {
          let godina = JSON.stringify(this.azrrodjendan.getFullYear());
          let mesec = JSON.stringify(this.azrrodjendan.getMonth() + 1);
          let dan = JSON.stringify(this.azrrodjendan.getDate());
          let s = godina + "-" + mesec + "-" + dan;
          kor.Datum = s;
        }
        if (this.azrmesto1 != null && this.azrmesto1 != "") {
          kor.Mesto = this.azrmesto1;
        }
        if (this.azremail1 != null && this.azremail1 != "") {
          kor.Email = this.azremail1;
        }
        this.servis.azurirajAdmina(kor).subscribe();
      } else {
        if (kor.Tip == "Preduzece") {
          if (this.azrskr != null && this.azrskr != "") {
            kor.Username == this.azrusername;
          }
          if (this.azrlozinka2 != null && this.azrlozinka2 != "") {
            kor.Password = this.azrlozinka3;
          }
          if (this.azrime != null && this.azrime != "") {
            kor.Ime == this.azrime;
          }
          if (this.azrprezime != null && this.azrprezime != "") {
            kor.Prezime == this.azrprezime;
          }
          if (this.provera(this.azrdatumOsn)) {
            let godina = JSON.stringify(this.azrdatumOsn.getFullYear());
            let mesec = JSON.stringify(this.azrdatumOsn.getMonth() + 1);
            let dan = JSON.stringify(this.azrdatumOsn.getDate());
            let s = godina + "-" + mesec + "-" + dan;
            kor.Datum = s;
          }
          if (this.azrmesto2 != null && this.azrmesto2 != "") {
            kor.Mesto = this.azrmesto2;
          }
          if (this.azremail2 != null && this.azremail2 != "") {
            kor.Email = this.azremail2;
          }
          this.servis.azurirajAdmina(kor).subscribe();
        }
      }
    }
  }

  odjava() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  promenaLozinke() {
    this.prikaz = 5;
  }

  promLoz() {
    if (this.strloz == null || this.strloz == "" || this.novloz == null || this.novloz == "" || this.novloz2 == null || this.novloz2 == "") {
      this._snackBar.open("Niste uneli sve podatke", "OK", {
        duration: 2000,
      });
      return;
    }
    this.servis.dohvKorisnika(localStorage.getItem("username"), this.strloz).subscribe(data => {
      if (data[0] != null) {
        if (this.novloz == this.novloz2) {
          let body: any = {
            username: localStorage.getItem("username"),
            password: this.novloz
          };
          this.servis.promeniLozinku(body).subscribe();
        } else {
          this._snackBar.open("Niste uneli iste lozinke", "OK", {
            duration: 2000,
          });
        }
      } else {
        this._snackBar.open("Pogrešili ste staru lozinku", "OK", {
          duration: 2000,
        });
      }
    });
  }

}
