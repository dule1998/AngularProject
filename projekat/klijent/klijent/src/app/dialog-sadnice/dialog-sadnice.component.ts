import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sadnica } from '../interfejsi/sadnica';
import { AgroservisService } from '../agroservis.service';
import { Magacin } from '../interfejsi/magacin';

@Component({
  selector: 'app-dialog-sadnice',
  templateUrl: './dialog-sadnice.component.html',
  styleUrls: ['./dialog-sadnice.component.css']
})
export class DialogSadniceComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogSadniceComponent>, @Inject(MAT_DIALOG_DATA) public data: Sadnica, private servis: AgroservisService) { }

  magSadnice: Magacin[] = [];
  magPreparati: Magacin[] = [];

  ngOnInit(): void {
    this.servis.dohvMagacin2(this.data.IdR).subscribe(result => {
      this.magSadnice = result.filter(mag => mag.Tip == "Sadnica");
      this.magPreparati = result.filter(mag => mag.Tip == "Preparat");
    });
  }

  izvadi() {
    this.data.Stanje = 1;
    this.servis.azurirajSadnicu(this.data).subscribe();
    this.servis.zauzetaSadnica(this.data.IdR, this.data.IdS).subscribe();
  }

  posadi(mags: Magacin) {
    this.data.BrojDana = mags.BrojDana;
    this.data.Progres = 0;
    this.data.Naziv = mags.Naziv;
    this.data.Stanje = 2;
    this.data.Proizvodjac = mags.Proizvodjac;
    mags.Kolicina--;
    if (mags.Kolicina == 0) {
      this.magSadnice.forEach((element, index) => {
        if (mags.IdM == element.IdM) {
          this.magSadnice.splice(index, 1);
        }
      });
      this.servis.izbrisiMagacin(mags.IdM).subscribe();
    } else {
      this.servis.azurirajMagacin(mags).subscribe();
    }
    this.servis.dodajSadnicu(this.data).subscribe(result => {
      this.data.IdS = result[0].IdS;
    });
    let ras = { IdR: this.data.IdR }
    this.servis.azurirajRasadnik(ras).subscribe();
  }

  upotrebi(magp: Magacin) {
    if ((this.data.Progres + magp.BrojDana) > this.data.BrojDana) {
      this.data.Progres = this.data.BrojDana;
    } else {
      this.data.Progres += magp.BrojDana;
    }
    magp.Kolicina--;
    if (magp.Kolicina == 0) {
      this.magPreparati.forEach((element, index) => {
        if (magp.IdM == element.IdM) {
          this.magPreparati.splice(index, 1);
        }
      });
      this.servis.izbrisiMagacin(magp.IdM).subscribe();
    } else {
      this.servis.azurirajMagacin(magp).subscribe();
    }
    this.servis.azurirajSadnicu(this.data).subscribe();
  }

  izadji() {
    this.dialogRef.close(this.data);
  }

}
