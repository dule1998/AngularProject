import { Component, OnInit } from '@angular/core';
import { AgroservisService } from '../agroservis.service';
import { Router } from '@angular/router';
import { Logkor } from '../interfejsi/logkor';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-logovanje',
  templateUrl: './logovanje.component.html',
  styleUrls: ['./logovanje.component.css']
})
export class LogovanjeComponent implements OnInit {

  constructor(private servis: AgroservisService, private router: Router, private _snackBar: MatSnackBar) { }

  lozinka: string;
  korIme: string;

  ngOnInit(): void {

  }

  prijavise() {
    this.servis.dohvKorisnika(this.korIme, this.lozinka).subscribe(data => {
      if (data[0] != null) {
        let l: Logkor = data[0];
        localStorage.setItem("username", this.korIme);
        localStorage.setItem("tip", l.Tip);
        localStorage.setItem("id", JSON.stringify(l.IdK));
        if (l.Tip == "Admin") {
          this.router.navigate(['/admin']);
        }
        if (l.Tip == "Poljoprivrednik") {
          this.router.navigate(['/poljoprivrednik']);
        }
        if (l.Tip == "Preduzece") {
          this.router.navigate(['/preduzece']);
        }
      } else {
        this._snackBar.open("Pogrešno uneti podaci", "OK", {
          duration: 2000,
        });
      }
    });
  }

}
