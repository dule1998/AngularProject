import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AgroservisService } from '../agroservis.service';
import { Narudzbina } from '../interfejsi/narudzbina';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Kurir } from '../interfejsi/kurir';
import { Prodavnica } from '../interfejsi/prodavnica';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Statistika } from '../interfejsi/statistika';

@Component({
  selector: 'app-preduzece',
  templateUrl: './preduzece.component.html',
  styleUrls: ['./preduzece.component.css']
})
export class PreduzeceComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private servis: AgroservisService, private _snackBar: MatSnackBar) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable) tabela: MatTable<Narudzbina>;
  @ViewChild(MatTable) tabela2: MatTable<Prodavnica>;

  dataSource: MatTableDataSource<Narudzbina> = new MatTableDataSource<Narudzbina>();

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  }

  barChartLabels = [];
  barChartType = 'bar';
  barChartLegend = true;

  barChartData = [
    { data: [], label: 'Broj narudžbina poslednjih 30 dana' }
  ]

  username: string;
  mesto: string;
  brKurira: number;
  lat: number;
  lon: number;
  naziv: string;
  tip: string;
  kolicina: number;
  brojDana: number;
  cena: number;
  perioda;
  strloz: string;
  novloz: string;
  novloz2: string;

  prikaz: number = 0;

  narudzbine: Narudzbina[] = [];
  prodavnica: Prodavnica[] = [];
  statistika: Statistika[] = [];

  kolone: string[] = ["Username", "ImeRas", "Mesto", "DatumNar", "Status", "prihvati", "odbi"];
  kolone1: string[] = ["naziv", "kolicina", "procena", "detalji", "obrisi"];

  ngOnInit(): void {
    if (localStorage.getItem("tip") == "Preduzece") {
      this.username = localStorage.getItem("username");
      this.servis.dohvProdavnicu2(this.username).subscribe(data => {
        this.prodavnica = data;
      });
      this.servis.dohvNarudzbine(this.username).subscribe(data => {
        this.narudzbine = data;
        this.narudzbine.forEach(element => {
          let dat: string = element.DatumNar.slice(0, 10);
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
          element.DatumNar = godina + "-" + ((mesec < 10) ? "0" : "") + mesec + "-" + ((dann < 10) ? "0" : "") + dann;
        });
        this.dataSource.data = this.narudzbine;
        this.dataSource.sort = this.sort;
        this.narudzbine.forEach(element => {
          element.DatumNar = element.DatumNar.slice(0, 10);
        });
      });
      this.servis.dohvMesto(this.username).subscribe(data => {
        this.mesto = data[0].Mesto;
        this.brKurira = data[0].BrKurira;
        this.servis.dohvKoordinate(this.mesto).subscribe(data1 => {
          this.lat = 0;
          this.lon = 0;
          this.lat = data1.resourceSets[0].resources[0].point.coordinates[0];
          this.lon = data1.resourceSets[0].resources[0].point.coordinates[1];
        });
      });
      this.servis.dohvStat(JSON.parse(localStorage.getItem("id"))).subscribe(data => {
        this.statistika = data;
        this.statistika.forEach(element => {
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
          element.Datum = godina + "-" + ((mesec < 10) ? "0" : "") + mesec + "-" + ((dann < 10) ? "0" : "") + dann;
        });
      });
      this.perioda = setInterval(() => {
        this.barChartData[0].data = [];
        this.barChartLabels = [];
        let datum = new Date();
        let god: string = datum.getFullYear() + "";
        let mes: string = (datum.getMonth() + 1) + "";
        let dan: string = datum.getDate() + "";
        let s: string = god + "-" + (datum.getMonth() < 9 ? "0" : "") + mes + "-" + (datum.getDate() < 10 ? "0" : "") + dan;
        this.barChartLabels.push(s);
        let datum1 = new Date();
        this.barChartData[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.statistika.forEach(element => {
          if (element.Datum == s) {
            this.barChartData[0].data[29] = element.BrNar;
          }
        });
        for (let index = 0; index < 29; index++) {
          let d: number;
          if ((datum.getDate() - 1) == 0) {
            if (datum.getMonth() == 0 || datum.getMonth() == 1 || datum.getMonth() == 3 || datum.getMonth() == 5 || datum.getMonth() == 7 || datum.getMonth() == 8 || datum.getMonth() == 10) {
              d = 31;
            } else {
              if (datum.getMonth() == 4 || datum.getMonth() == 6 || datum.getMonth() == 9 || datum.getMonth() == 11) {
                d = 30;
              } else {
                if (datum.getFullYear() % 4 == 0 && datum.getFullYear() % 400 != 0) {
                  d = 29;
                } else {
                  d = 28;
                }
              }
            }
            if (datum.getMonth() == 0) {
              datum1 = new Date((datum.getFullYear() - 1) + "-" + (datum.getMonth() + 12) + "-" + d);
            } else {
              datum1 = new Date(datum.getFullYear() + "-" + datum.getMonth() + "-" + d);
            }
          } else {
            datum1 = new Date(datum.getFullYear() + "-" + (datum.getMonth() + 1) + "-" + (datum.getDate() - 1));
          }
          let god1: string = datum1.getFullYear() + "";
          let mes1: string = (datum1.getMonth() + 1) + "";
          let dan1: string = datum1.getDate() + "";
          let s1: string = god1 + "-" + (datum1.getMonth() < 9 ? "0" : "") + mes1 + "-" + (datum1.getDate() < 10 ? "0" : "") + dan1;
          this.barChartLabels.splice(0, 0, s1);
          this.statistika.forEach(element => {
            if (element.Datum == s1) {
              this.barChartData[0].data[29 - index - 1] = element.BrNar;
            }
          });
          datum = datum1;
        }
      }, 10000);
    } else {
      this.router.navigate(["/logovanje"]);
    }
  }

  ngOnDestroy(): void {
    if (this.perioda) {
      clearInterval(this.perioda);
    }
  }

  odjava() {
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  odbi(nar: string) {
    this.narudzbine.forEach((element, index) => {
      if (element.Narudzbina == nar) {
        this.narudzbine.splice(index, 1);
        this.dataSource.data = this.narudzbine;
      }
    });
    this.servis.izbrisiNarudzbinu(nar, this.username).subscribe();
  }

  prihvati(nar: Narudzbina) {
    if (this.brKurira > 0) {
      this.brKurira--;
      this.narudzbine.forEach((element, index) => {
        if (element.Narudzbina == nar.Narudzbina) {
          this.narudzbine.splice(index, 1);
          this.dataSource.data = this.narudzbine;
        }
      });
      let b: boolean = true;
      let stat: Statistika = {
        IdStat: null,
        Datum: null,
        BrNar: null,
        IdK: JSON.parse(localStorage.getItem("id"))
      }
      let datum: Date = new Date();
      let god: string = datum.getFullYear() + "";
      let mes: string = (datum.getMonth() + 1) + "";
      let dan: string = datum.getDate() + "";
      let s: string = god + "-" + (datum.getMonth() < 9 ? "0" : "") + mes + "-" + (datum.getDate() < 10 ? "0" : "") + dan;
      this.statistika.forEach(element => {
        if (element.Datum == s) {
          element.BrNar++;
          stat.Datum = element.Datum;
          stat.BrNar = element.BrNar;
          stat.IdStat = element.IdStat;
          b = false;
        }
      });
      if (b) {
        stat.Datum = s;
        stat.BrNar = 1;
        this.statistika.push(stat);
        this.servis.dodajStat(stat).subscribe();
      } else {
        this.servis.azurStat(stat).subscribe();
      }
      this.servis.dohvKoordinate(nar.Mesto).subscribe(data => {
        let lat1: number = 0;
        let lon1: number = 0;
        lat1 = data.resourceSets[0].resources[0].point.coordinates[0];
        lon1 = data.resourceSets[0].resources[0].point.coordinates[1];
        this.servis.dohvVreme(this.lat, this.lon, lat1, lon1).subscribe(data1 => {
          let k: Kurir = {
            IdK: JSON.parse(localStorage.getItem("id")),
            Narudzbina: nar.Narudzbina,
            Vreme: data1.resourceSets[0].resources[0].results[0].travelDuration
          }
          this.servis.uposliKurira(k).subscribe();
        });
      });
    } else {
      let n: Narudzbina = null;
      this.narudzbine.forEach((element, index) => {
        if (element.Narudzbina == nar.Narudzbina) {
          n = element;
          n.Status = 1;
          this.narudzbine.splice(index, 1);
          this.servis.naCekanju(n).subscribe();
        }
      });
      this.narudzbine.splice(0, 0, n);
      this.dataSource.data = this.narudzbine;
      this.tabela.renderRows();
    }
  }

  prikazNar() {
    this.prikaz = 0;
  }

  onlajn() {
    this.prikaz = 1;
  }

  dodajProizvod() {
    this.prikaz = 2;
  }

  obrisi(id: number) {
    this.prodavnica.forEach((element, index) => {
      if (element.IdP == id) {
        this.prodavnica.splice(index, 1);
      }
    });
    this.servis.obrisiProizvod(id).subscribe();
  }

  korak1(stepper: MatStepper) {
    if (!(this.naziv == null || this.naziv == "")) {
      stepper.selected.completed = true;
      stepper.next();
    }
  }

  korak2(stepper: MatStepper) {
    if (!(this.tip == null || this.tip == "")) {
      stepper.selected.completed = true;
      stepper.next();
    }
  }

  korak3(stepper: MatStepper) {
    if (!(this.kolicina == null || this.kolicina < 1)) {
      stepper.selected.completed = true;
      stepper.next();
    }
  }

  korak4(stepper: MatStepper) {
    if (!(this.brojDana == null || this.brojDana < 1)) {
      stepper.selected.completed = true;
      stepper.next();
    }
  }

  korak5(stepper: MatStepper) {
    if (!(this.cena == null || this.cena < 0)) {
      stepper.selected.completed = true;
      let p: Prodavnica = {
        IdP: null,
        Naziv: this.naziv,
        Username: null,
        Tip: this.tip,
        Kolicina: this.kolicina,
        ProOcena: 0,
        BrOcena: 0,
        IdK: JSON.parse(localStorage.getItem("id")),
        BrDana: this.brojDana,
        Cena: this.cena
      };
      let b: boolean = false;
      this.prodavnica.forEach(element => {
        if (element.Naziv == this.naziv && element.Tip == this.tip) {
          if (element.Cena == this.cena && element.BrDana == this.brojDana) {
            p.IdP = element.IdP;
            p.Kolicina += element.Kolicina
            element.Kolicina = p.Kolicina;
            b = true;
            this.servis.azurirajProdavnicu(p).subscribe();
          } else {
            this._snackBar.open("Loše ste uneli podatke", "OK", {
              duration: 2000,
            });
            console.log("usao");
            b = true;
          }
        }
      });
      if (!b) {
        this.prodavnica.push(p);
        this.tabela2.renderRows();
        this.servis.dodajProizvod(p).subscribe();
      }
      this.naziv = null;
      this.tip = null;
      this.brojDana = null;
      this.kolicina = null;
      this.cena = null;
      stepper.reset();
    }
  }

  prikazGraf() {
    this.barChartData[0].data = [];
    this.barChartLabels = [];
    let datum = new Date();
    let god: string = datum.getFullYear() + "";
    let mes: string = (datum.getMonth() + 1) + "";
    let dan: string = datum.getDate() + "";
    let s: string = god + "-" + (datum.getMonth() < 9 ? "0" : "") + mes + "-" + (datum.getDate() < 10 ? "0" : "") + dan;
    this.barChartLabels.push(s);
    let datum1 = new Date();
    this.barChartData[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.statistika.forEach(element => {
      if (element.Datum == s) {
        this.barChartData[0].data[29] = element.BrNar;
      }
    });
    for (let index = 0; index < 29; index++) {
      let d: number;
      if ((datum.getDate() - 1) == 0) {
        if (datum.getMonth() == 0 || datum.getMonth() == 1 || datum.getMonth() == 3 || datum.getMonth() == 5 || datum.getMonth() == 7 || datum.getMonth() == 8 || datum.getMonth() == 10) {
          d = 31;
        } else {
          if (datum.getMonth() == 4 || datum.getMonth() == 6 || datum.getMonth() == 9 || datum.getMonth() == 11) {
            d = 30;
          } else {
            if (datum.getFullYear() % 4 == 0 && datum.getFullYear() % 400 != 0) {
              d = 29;
            } else {
              d = 28;
            }
          }
        }
        if (datum.getMonth() == 0) {
          datum1 = new Date((datum.getFullYear() - 1) + "-" + (datum.getMonth() + 12) + "-" + d);
        } else {
          datum1 = new Date(datum.getFullYear() + "-" + datum.getMonth() + "-" + d);
        }
      } else {
        datum1 = new Date(datum.getFullYear() + "-" + (datum.getMonth() + 1) + "-" + (datum.getDate() - 1));
      }
      let god1: string = datum1.getFullYear() + "";
      let mes1: string = (datum1.getMonth() + 1) + "";
      let dan1: string = datum1.getDate() + "";
      let s1: string = god1 + "-" + (datum1.getMonth() < 9 ? "0" : "") + mes1 + "-" + (datum1.getDate() < 10 ? "0" : "") + dan1;
      this.barChartLabels.splice(0, 0, s1);
      this.statistika.forEach(element => {
        if (element.Datum == s1) {
          this.barChartData[0].data[29 - index - 1] = element.BrNar;
        }
      });
      datum = datum1;
    }
    this.prikaz = 3;
  }

  promLoz() {
    if (this.strloz == null || this.strloz == "" || this.novloz == null || this.novloz == "" || this.novloz2 == null || this.novloz2 == "") {
      this._snackBar.open("Niste uneli sve podatke", "OK", {
        duration: 2000,
      });
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

  promenaLozinke() {
    this.prikaz = 4;
  }

}
