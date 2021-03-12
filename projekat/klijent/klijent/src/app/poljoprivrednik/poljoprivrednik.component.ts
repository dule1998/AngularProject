import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Rasadnik } from '../interfejsi/rasadnik';
import { AgroservisService } from '../agroservis.service';
import { Router } from '@angular/router';
import { Sadnica } from '../interfejsi/sadnica';
import { MatDialog } from '@angular/material/dialog';
import { DialogSadniceComponent } from '../dialog-sadnice/dialog-sadnice.component';
import { Magacin } from '../interfejsi/magacin';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Prodavnica } from '../interfejsi/prodavnica';
import { Komentar } from '../interfejsi/komentar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Narucio } from '../interfejsi/narucio';

@Component({
  selector: 'app-poljoprivrednik',
  templateUrl: './poljoprivrednik.component.html',
  styleUrls: ['./poljoprivrednik.component.css']
})
export class PoljoprivrednikComponent implements OnInit, OnDestroy {

  constructor(private servis: AgroservisService, private router: Router, private _snackBar: MatSnackBar, private _snackBar1: MatSnackBar, public dialog: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) tabelica: MatTable<Magacin>;

  ngOnDestroy(): void {
    if (this.pomocna) {
      clearInterval(this.pomocna);
    }
    if (this.pomocna1) {
      clearInterval(this.pomocna1);
    }
    if (this.pomocna2) {
      clearInterval(this.pomocna2);
    }
  }

  rasadnici: Rasadnik[] = [];
  sadnice: Sadnica[] = [];
  nalazi: number[] = [];
  mag: Magacin[] = [];
  online: Prodavnica[] = [];
  komentari: Komentar[] = [];
  korpa: Magacin[] = [];
  narucio: Narucio[] = [];
  kolone: string[] = ["imeras", "mesto", "brzas", "brslob", "voda", "temp", "prikaz"];
  kolone1: string[] = ["Naziv", "Proizvodjac", "Kolicina", "Otkazi"];
  kolone2: string[] = ["naziv", "username", "kolicina", "procena", "stanje", "jos"];

  dataSource: MatTableDataSource<Magacin> = new MatTableDataSource<Magacin>();

  prikaz: number = 0;
  prikaz1: number = 0;
  prikaz2: number = 0;
  detaljno: number = 0;
  kupovina: number = 0;
  komentarisi: number = 0;

  red: number;
  kol: number;
  voda: number;
  temperatura: number;
  idRasadnika: number = -1;
  imeRas: string;
  username: string;
  komentar: string;
  ocena: number;
  idProizvoda: number;
  nazivRas: string;
  mestoRas: string;
  duzinaRas: number;
  sirinaRas: number;
  upozorenjeRas: Rasadnik;
  strloz: string;
  novloz: string;
  novloz2: string;
  idMag: number = -1;

  nazivFilter = new FormControl();
  proizFilter = new FormControl();
  kolFilter = new FormControl();

  filterValues = {
    IdM: '',
    Naziv: '',
    Tip: '',
    Proizvodjac: '',
    BrojDana: '',
    Kolicina: '',
    IdR: '',
    Narudzbina: '',
    DatumNar: '',
    Aktivan: ''
  }

  ngOnInit(): void {
    if (localStorage.getItem("tip") == "Poljoprivrednik") {
      let id: number = JSON.parse(localStorage.getItem("id"));
      this.username = localStorage.getItem("username");
      this.servis.dohvRasadnike(id).subscribe(data => {
        this.rasadnici = data;
        let b: boolean = false;
        this.rasadnici.forEach(element => {
          if ((element.Voda < 75 || element.Temperatura < 12) && b == false) {
            this.upozorenjeRas = element;
            b = true;
            this._snackBar1.open("Rasadnik " + element.ImeRas + " zahteva održavanje", null, {
              duration: undefined,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
            });
          }
        });
      });
      this.servis.dohvNarucio(this.username).subscribe(data => {
        this.narucio = data;
      })
    }
  }

  odjava() {
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  prikazi(id: number, duzina: number, sirina: number) {
    this.prikaz = 1;
    this.idRasadnika = id;
    this.rasadnici.forEach(element => {
      if (element.IdR == id) {
        this.voda = element.Voda;
        this.temperatura = element.Temperatura;
      }
    });
    this.red = duzina;
    this.kol = sirina;
    this.servis.dohvSadnice(id).subscribe(data => {
      this.sadnice = data;
      this.nalazi = new Array(this.kol * this.red).fill(0);
      this.sadnice.forEach(element => {
        if (element.Progres == element.BrojDana && element.Stanje == 2) {
          this.nalazi[element.Pozicija] = 3;
        } else {
          this.nalazi[element.Pozicija] = element.Stanje;
        }
      });

    });
  }

  nizBr(n: number): any[] {
    return Array(n);
  }

  plusL() {
    this.rasadnici.forEach(element => {
      if (element.IdR == this.idRasadnika) {
        element.Voda = element.Voda + 1;
        if (this.upozorenjeRas == element && element.Temperatura > 11 && element.Voda > 74) {
          this.upozorenjeRas = null;
          this._snackBar1.dismiss();
          let b: boolean = false;
          this.rasadnici.forEach(elem => {
            if ((elem.Voda < 75 || elem.Temperatura < 12) && b == false) {
              this.upozorenjeRas = elem;
              b = true;
            }
          });
        }
        this.voda = element.Voda;
        this.servis.dodajVodu(element).subscribe();
      }
    });
  }

  minusL() {
    this.rasadnici.forEach(element => {
      if (element.IdR == this.idRasadnika && element.Voda > 0) {
        element.Voda = element.Voda - 1;
        this.voda = element.Voda;
        if ((element.Temperatura < 12 || element.Voda < 75) && this.upozorenjeRas == null) {
          this.upozorenjeRas = element;
          this._snackBar1.open("Rasadnik " + element.ImeRas + " zahteva održavanje", null, {
            duration: undefined,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        }
        this.servis.smanjiVodu(element).subscribe();
      }
    });
  }

  plusT() {
    this.rasadnici.forEach(element => {
      if (element.IdR == this.idRasadnika) {
        element.Temperatura = element.Temperatura + 1;
        if (this.upozorenjeRas == element && element.Temperatura > 11 && element.Voda > 74) {
          this.upozorenjeRas = null;
          this._snackBar1.dismiss();
          let b: boolean = false;
          this.rasadnici.forEach(elem => {
            if ((elem.Voda < 75 || elem.Temperatura < 12) && b == false) {
              this.upozorenjeRas = elem;
              b = true;
            }
          });
        }
        this.temperatura = element.Temperatura;
        this.servis.dodajTemp(element).subscribe();
      }
    });
  }

  minusT() {
    this.rasadnici.forEach(element => {
      if (element.IdR == this.idRasadnika && element.Temperatura > 0) {
        element.Temperatura = element.Temperatura - 1;
        this.temperatura = element.Temperatura;
        if ((element.Temperatura < 12 || element.Voda < 75) && this.upozorenjeRas == null) {
          this.upozorenjeRas = element;
          this._snackBar1.open("Rasadnik " + element.ImeRas + " zahteva održavanje", null, {
            duration: undefined,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        }
        this.servis.smanjiTemp(element).subscribe();
      }
    });
  }

  azurRas() {
    this.servis.dohvRasadnike(JSON.parse(localStorage.getItem("id"))).subscribe(data => {
      let b: boolean = false;
      this.rasadnici.forEach((element, index) => {
        element.Voda = data[index].Voda;
        element.Temperatura = data[index].Temperatura;
        element.BrZas = data[index].BrZas;
        if (this.idRasadnika == element.IdR) {
          this.voda = element.Voda;
          this.temperatura = element.Temperatura;
        }
        if ((element.Voda < 75 || element.Temperatura < 12) && b == false && this.upozorenjeRas == null) {
          this.upozorenjeRas = element;
          b = true;
          this._snackBar1.open("Rasadnik " + element.ImeRas + " zahteva održavanje", null, {
            duration: undefined,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        }
      });
    });
  }

  azurSad() {
    this.servis.dohvSadnice(this.idRasadnika).subscribe(data => {
      this.sadnice = data;
      if (this.sadnice.length > 0) {
        let niz: number[] = new Array(this.kol * this.red).fill(0);
        this.sadnice.forEach(element => {
          if (element.Progres == element.BrojDana && element.Stanje == 2) {
            niz[element.Pozicija] = 3;
          } else {
            niz[element.Pozicija] = element.Stanje;
          }
        });
        this.nalazi = niz;
      }
    });
  }

  azurMag() {
    if (this.idMag != -1) {
      this.servis.dohvMagacin(this.idMag).subscribe(data => {
        this.mag = data;
        this.dataSource.data = this.mag;
      });
    }
  }

  pomocna = setInterval(() => { this.azurRas(); }, 10000);
  pomocna1 = setInterval(() => { this.azurSad(); }, 120000);
  pomocna2 = setInterval(() => { this.azurMag(); }, 120000);

  openDialog(poz: number) {
    let num: number = -1;
    if (this.sadnice.length == 0) {
      num = 1;
    }
    this.sadnice.forEach(element => {
      if (element.IdS > num) {
        num = element.IdS;
      }
    });
    num++;
    let sad: Sadnica = {
      IdS: num,
      Progres: null,
      Naziv: null,
      BrojDana: null,
      Stanje: null,
      Pozicija: poz,
      Proizvodjac: null,
      IdR: this.idRasadnika
    };
    this.sadnice.forEach(element => {
      if (element.Pozicija == poz) {
        sad = element;
      }
    });

    const dialogRef = this.dialog.open(DialogSadniceComponent, {
      disableClose: true, data: {
        IdS: sad.IdS,
        Progres: sad.Progres,
        Naziv: sad.Naziv,
        BrojDana: sad.BrojDana,
        Stanje: sad.Stanje,
        Pozicija: sad.Pozicija,
        Proizvodjac: sad.Proizvodjac,
        IdR: sad.IdR
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let b: boolean = true;
      if ((result.Progres == result.BrojDana) && (result.Stanje == 2)) {
        this.nalazi[result.Pozicija] = 3;
      } else if (result.Stanje == 1) {
        this.nalazi[result.Pozicija] = 1;
      } else if ((result.Progres < result.BrojDana) && (result.Stanje == 2) && (this.nalazi[result.Pozicija] == 0)) {
        if (this.sadnice.length == 0) {
          this.sadnice = [{
            IdS: result.IdS,
            Progres: result.Progres,
            Naziv: result.Naziv,
            BrojDana: result.BrojDana,
            Stanje: result.Stanje,
            Pozicija: result.Pozicija,
            Proizvodjac: result.Proizvodjac,
            IdR: result.IdR
          }]
        } else {
          this.sadnice.push(result);
        }
        b = false;
        this.rasadnici.forEach(element => {
          if (element.IdR == this.idRasadnika) {
            element.BrZas++;
          }
        });
        this.nalazi[result.Pozicija] = 2;
      }
      if (b) {
        this.sadnice.forEach((element, index) => {
          if (element.Pozicija == result.Pozicija) {
            this.sadnice[index] = result;
          }
        });
      }
    });
  }

  prikazRas() {
    if (this.prikaz1 == 1 && this.korpa.length > 0) {
      this.korpa = [];
      this.imeRas = "";
      this.openSnackBar("Kupovina je prekinuta", "OK");
    }
    this.idMag = -1;
    this.prikaz1 = 0;
    this.prikaz = 0;
    this.idRasadnika = -1;
    this.detaljno = 0;
  }

  onlajn() {
    this.servis.dohvProdavnicu().subscribe(data => {
      if (this.korpa.length > 0) {
        this.korpa = [];
        this.imeRas = "";
        this.openSnackBar("Kupovina je prekinuta", "OK");
      }
      this.idMag = -1;
      this.online = data;
      this.prikaz1 = 1;
      this.detaljno = 0;
    });
  }

  dodajRasadnik() {
    if (this.prikaz1 == 1 && this.korpa.length > 0) {
      this.korpa = [];
      this.imeRas = "";
      this.openSnackBar("Kupovina je prekinuta", "OK");
    }
    this.idMag = -1;
    this.prikaz1 = 2;
  }

  magacin() {
    this.idMag = -1;
    if (this.prikaz1 == 1 && this.korpa.length > 0) {
      this.korpa = [];
      this.imeRas = "";
      this.openSnackBar("Kupovina je prekinuta", "OK");
    }
    this.proizFilter.valueChanges.subscribe((proizFilterValue) => {
      this.filterValues['Proizvodjac'] = proizFilterValue;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.nazivFilter.valueChanges.subscribe((nazivFilterValue) => {
      this.filterValues['Naziv'] = nazivFilterValue;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.kolFilter.valueChanges.subscribe((kolFilterValue) => {
      this.filterValues['Kolicina'] = kolFilterValue;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();

    if (this.prikaz1 == 1) {
      this.korpa = [];
      this.imeRas = "";
      this.openSnackBar("Kupovina je prekinuta", "OK");
    }

    this.prikaz1 = 3;
    this.prikaz2 = 0;
    this.detaljno = 0;
  }

  prikMag(id: number) {
    this.servis.dohvMagacin(id).subscribe(data => {
      this.idMag = id;
      this.mag = data;
      this.dataSource.data = this.mag;
      this.dataSource.sort = this.sort;
      this.prikaz2 = 1;
    });
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Magacin, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let nazivFound = data.Naziv.toString().trim().toLowerCase().indexOf(searchString.Naziv.toLowerCase()) !== -1
      let proizFound = data.Proizvodjac.toString().trim().toLowerCase().indexOf(searchString.Proizvodjac) !== -1
      let kolFound = data.Kolicina.toString().trim().indexOf(searchString.Kolicina) !== -1
      if (searchString.topFilter) {
        return nazivFound || proizFound || kolFound
      } else {
        return nazivFound && proizFound && kolFound
      }
    }
    return myFilterPredicate;
  }

  jos(id: number) {
    this.komentar = "";
    this.ocena = null;
    this.idProizvoda = id;
    this.servis.dohvKomentare(id).subscribe(data => {
      this.komentari = data;
      let b: boolean = false;
      let b1: boolean = false;
      this.komentari.forEach(element => {
        if (element.Username == this.username) {
          this.komentarisi = 1;
          b = true;
        }
      });
      if (!b) {
        this.narucio.forEach(element => {
          if (element.IdP == id) {
            this.komentarisi = 0;
            b1 = true;
          }
        });
      } else {
        this.detaljno = 1;
        return;
      }
      if (!b1) {
        this.komentarisi = 1;
      }
      this.detaljno = 1;
    });
  }

  zapocni() {
    if (this.imeRas != null && this.imeRas != "") {
      let r: Rasadnik = this.rasadnici.find(pr => pr.ImeRas == this.imeRas);
      this.idRasadnika = r.IdR;
      this.kupovina = 1;
    } else {
      this.openSnackBar("Odaberite rasadnik", "OK");
    }
  }

  zavrsi() {
    this.openSnackBar("Sacekaj te momenat", "OK");
    let d: Date = new Date();
    let god: string = d.getFullYear() + "-";
    let mes: string = "";
    if ((d.getMonth() + 1) < 10) {
      mes = "0" + (d.getMonth() + 1) + "-";
    } else {
      mes = (d.getMonth() + 1) + "-";
    }
    let dan: string = "";
    if (d.getDate() < 10) {
      dan = "0" + d.getDate();
    } else {
      dan = d.getDate() + "";
    }
    let datum: string = god + mes + dan;
    let broj: Rasadnik = this.rasadnici.find(pr => pr.ImeRas == this.imeRas);
    let s: string = d + "RAS" + broj.IdR;
    this.korpa.forEach(element => {
      element.Narudzbina = s;
      element.DatumNar = datum;
      this.servis.dodajUMagacin(element).subscribe();
      let p: Prodavnica = this.online.find(pr => pr.Username == element.Proizvodjac && pr.Naziv == element.Naziv && pr.Tip == element.Tip);
      if (p != null) {
        let n: Narucio = this.narucio.find(pr => pr.IdP == p.IdP && pr.Username == this.username);
        if (n == null) {
          n = { Username: this.username, IdP: p.IdP };
          this.narucio.push(n);
          this.servis.dodajNarucio(n).subscribe();
        }
        this.servis.azurirajProdavnicu(p).subscribe();
      }
    });
    this.korpa = [];
    this.imeRas = null;
    this.idRasadnika = -1;
    this.kupovina = 0;
    this.openSnackBar("Kupovina je gotova", "OK");
  }

  koment() {
    if (this.komentar == null || this.komentar == "") {
      this.openSnackBar("Unesite komentar", "OK");
    } else {
      if (this.ocena < 1 || this.ocena > 5 || this.ocena == null) {
        this.ocena = null;
        this.openSnackBar("Ocene su u opsegu 1-5", "OK");
      } else {
        this.komentarisi = 1;
        let kom: Komentar = {
          Tekst: this.komentar,
          Ocena: this.ocena,
          Username: this.username,
          IdP: this.idProizvoda
        };
        let proizvod: Prodavnica = this.online.find(pr => pr.IdP == this.idProizvoda);
        proizvod.ProOcena = (proizvod.ProOcena * proizvod.BrOcena + this.ocena) / (proizvod.BrOcena + 1);
        proizvod.BrOcena++;
        this.komentari.push(kom);
        this.servis.unesiKomentar(kom).subscribe();
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  dodajUKorpu() {
    let p: Prodavnica = this.online.find(pr => pr.IdP == this.idProizvoda);
    if (p.Kolicina > 0) {
      p.Kolicina--;
      let m: Magacin = {
        IdM: null,
        Naziv: p.Naziv,
        Tip: p.Tip,
        Proizvodjac: p.Username,
        BrojDana: p.BrDana,
        Kolicina: 1,
        IdR: this.idRasadnika,
        Narudzbina: null,
        DatumNar: null,
        Aktivan: 1,
      }
      this.korpa.push(m);
    } else {
      this.openSnackBar("Nema proizvoda na stanju", "OK");
    }
  }

  obustavi() {
    this.korpa.forEach(element => {
      let p: Prodavnica = this.online.find(pr => pr.Username == element.Proizvodjac && pr.Naziv == element.Naziv && pr.Tip == element.Tip);
      if (p != null) {
        p.Kolicina++;
      }
    });
    this.korpa = [];
    this.imeRas = null;
    this.idRasadnika = -1;
    this.kupovina = 0;
  }

  vrati(id: number) {
    let m: Magacin = null;
    this.mag.forEach((element, index) => {
      if (element.IdM == id) {
        m = element;
        this.mag.splice(index, 1);
        this.dataSource.data = this.mag;
        this.tabelica.renderRows();
        this.servis.izbrisiMagacin2(id).subscribe();
      }
    });
    let p: Prodavnica = {
      IdP: null,
      Naziv: m.Naziv,
      Username: m.Proizvodjac,
      Tip: m.Tip,
      Kolicina: null,
      ProOcena: null,
      BrOcena: null,
      IdK: null,
      BrDana: null,
      Cena: null
    }
    this.servis.azurProd(p).subscribe();
  }

  daodajRas() {
    if (this.nazivRas == null || this.nazivRas == "" || this.mestoRas == null || this.mestoRas == "" || this.duzinaRas < 1 || this.sirinaRas < 1 || this.duzinaRas == null || this.sirinaRas == null) {
      this.openSnackBar("Loše ste uneli podatke", "OK");
    } else {
      let r: Rasadnik = {
        IdR: null,
        ImeRas: this.nazivRas,
        Mesto: this.mestoRas,
        BrZas: 0,
        Duzina: this.duzinaRas,
        Sirina: this.sirinaRas,
        Voda: 200,
        Temperatura: 18,
        IdK: JSON.parse(localStorage.getItem("id"))
      }
      this.servis.dodajRasadnik(r).subscribe(data => {
        if (data == null) {
          this.openSnackBar("Već postoji rasadnik sa ovim imenom", "OK");
        } else {
          this.rasadnici.push(data[0]);
        }
      });
    }
  }

  promenaLozinke() {
    if (this.prikaz1 == 1 && this.korpa.length > 0) {
      this.korpa = [];
      this.imeRas = "";
      this.openSnackBar("Kupovina je prekinuta", "OK");
    }
    this.idMag = -1;
    this.prikaz1 = 4;
    this.detaljno = 0;
  }

  promLoz() {
    if (this.strloz == null || this.strloz == "" || this.novloz == null || this.novloz == "" || this.novloz2 == null || this.novloz2 == "") {
      this.openSnackBar("Niste uneli sve podatke", "OK");
      return;
    }
    this.servis.dohvKorisnika(this.username, this.strloz).subscribe(data => {
      if (data[0] != null) {
        if (this.novloz == this.novloz2) {
          let body: any = {
            username: this.username,
            password: this.novloz
          };
          this.servis.promeniLozinku(body).subscribe();
        } else {
          this.openSnackBar("Niste uneli iste lozinke", "OK");
        }
      } else {
        this.openSnackBar("Pogrešili ste staru lozinku", "OK");
      }
    });
  }

}
