import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgroservisService } from '../agroservis.service';
import { Prodavnica } from '../interfejsi/prodavnica';
import { Komentar } from '../interfejsi/komentar';

@Component({
  selector: 'app-propred',
  templateUrl: './propred.component.html',
  styleUrls: ['./propred.component.css']
})
export class PropredComponent implements OnInit {

  constructor(private router: ActivatedRoute, private servis: AgroservisService) { }

  proizvod: Prodavnica;
  komentari: Komentar[] = [];

  ngOnInit(): void {
    let id: number = JSON.parse(this.router.snapshot.paramMap.get("id"));
    this.servis.dohvProizvod(id).subscribe(data => {
      this.proizvod = data[0];
    });
    this.servis.dohvKomentare(id).subscribe(data => {
      this.komentari = data;
    });
  }

}
