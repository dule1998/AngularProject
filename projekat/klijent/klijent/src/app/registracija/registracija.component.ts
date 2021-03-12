import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  constructor(private router: Router) { }
  
  ngOnInit(): void {

  }

  poljoprivrednik() {
    this.router.navigate(['/regpolj'])
  }

  preduzece() {
    this.router.navigate(['/regprivr'])
  }

}
