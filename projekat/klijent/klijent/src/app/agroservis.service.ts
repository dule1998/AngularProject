import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pojloprivrednik } from './interfejsi/poljoprivrednik';
import { Preduzece } from './interfejsi/preduzece';
import { Korisnik } from './interfejsi/korisnik';
import { Logkor } from './interfejsi/logkor';
import { Rasadnik } from './interfejsi/rasadnik';
import { Sadnica } from './interfejsi/sadnica';
import { Magacin } from './interfejsi/magacin';
import { Prodavnica } from './interfejsi/prodavnica';
import { Komentar } from './interfejsi/komentar';
import { Narucio } from './interfejsi/narucio';
import { Narudzbina } from './interfejsi/narudzbina';
import { Kurir } from './interfejsi/kurir';
import { Statistika } from './interfejsi/statistika';

@Injectable({
  providedIn: 'root'
})
export class AgroservisService {

  constructor(private http: HttpClient) { }

  url = "http://localhost:3000";

  dohvKorisnika(username: string, password: string) {
    return this.http.get<Logkor[]>(this.url + "/korisnici" + "/" + username + "/" + password);
  }

  izbrisiKorisnika(username: string) {
    return this.http.delete(this.url + "/korisnici" + "/" + username);
  }

  dodajPoljoprivrednika(body: Pojloprivrednik) {
    return this.http.post(this.url + "/korisnici" + "/polj", body);
  }

  dodajPreduzece(body: Preduzece) {
    return this.http.post(this.url + "/korisnici" + "/pred", body);
  }

  dohvKorisnike() {
    return this.http.get<Korisnik[]>(this.url + "/korisnici");
  }

  azurirajKorisnika(body: Korisnik) {
    return this.http.put(this.url + "/korisnici", body);
  }

  azurirajPoljoprivrednika(body: Korisnik) {
    return this.http.put(this.url + "/korisnici/polj", body);
  }

  azurirajPreduzece(body: Korisnik) {
    return this.http.put(this.url + "/korisnici/pred", body);
  }

  azurirajAdmina(body: Korisnik) {
    return this.http.put(this.url + "/korisnici/admin", body);
  }

  dohvRasadnike(id: number) {
    return this.http.get<Rasadnik[]>(this.url + "/rasadnici/" + id);
  }

  dohvSadnice(id: number) {
    return this.http.get<Sadnica[]>(this.url + "/sadnice" + "/" + id);
  }

  dodajVodu(body: Rasadnik) {
    return this.http.put(this.url + "/rasadnici/vodapl", body);
  }

  smanjiVodu(body: Rasadnik) {
    return this.http.put(this.url + "/rasadnici/vodamn", body);
  }

  dodajTemp(body: Rasadnik) {
    return this.http.put(this.url + "/rasadnici/temperaturapl", body);
  }

  smanjiTemp(body: Rasadnik) {
    return this.http.put(this.url + "/rasadnici/temperaturamn", body);
  }

  dohvMagacin(id: number) {
    return this.http.get<Magacin[]>(this.url + "/magacin/" + id);
  }

  izbrisiMagacin(id: number) {
    return this.http.delete(this.url + "/magacin/" + id);
  }

  azurirajMagacin(body: Magacin) {
    return this.http.put(this.url + "/magacin", body);
  }

  azurirajSadnicu(body: Sadnica) {
    return this.http.put(this.url + "/sadnice", body);
  }

  dodajSadnicu(body: Sadnica) {
    return this.http.post<any[]>(this.url + "/sadnice", body);
  }

  azurirajRasadnik(body: any) {
    return this.http.put(this.url + "/rasadnici/zas", body);
  }

  zauzetaSadnica(idr: number, ids: number) {
    return this.http.get(this.url + "/rassad/" + idr + "/" + ids);
  }

  dohvMagacin2(id: number) {
    return this.http.get<Magacin[]>(this.url + "/magacin/mag/" + id);
  }

  dohvProdavnicu() {
    return this.http.get<Prodavnica[]>(this.url + "/prodavnica");
  }

  dohvKomentare(id: number) {
    return this.http.get<Komentar[]>(this.url + "/komentari/" + id);
  }

  unesiKomentar(body: Komentar) {
    return this.http.post(this.url + "/komentari", body);
  }

  dohvNarucio(username: string) {
    return this.http.get<Narucio[]>(this.url + "/narucio/" + username);
  }

  azurirajProdavnicu(body: Prodavnica) {
    return this.http.put(this.url + "/prodavnica", body);
  }

  dodajUMagacin(body: Magacin) {
    return this.http.post(this.url + "/magacin", body);
  }

  azurProd(body: Prodavnica) {
    return this.http.put(this.url + "/prodavnica/vrati", body);
  }

  dodajRasadnik(body: Rasadnik) {
    return this.http.post<Rasadnik[]>(this.url + "/rasadnici", body);
  }

  dohvNarudzbine(username: string) {
    return this.http.get<Narudzbina[]>(this.url + "/magacin/nar/" + username);
  }

  izbrisiNarudzbinu(nar: string, username: string) {
    return this.http.delete(this.url + "/magacin/nar/" + nar + "/" + username);
  }

  dohvKoordinate(mesto: string) {
    return this.http.get<any>("http://dev.virtualearth.net/REST/v1/Locations?query=" + mesto + "locationQuery&key=AjKsWPmToLkMWJM9vMxh5DgCLDBs7s9-v482h8nW_BjqGH3rcEx-20dZueRS6D5C");
  }

  dohvVreme(lat0: number, lon0: number, lat1: number, lon1: number) {
    return this.http.get<any>("https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=" + lat0 + "," + lon0 + "&destinations=" + lat1 + "," + lon1 + "&travelMode=driving&timeUnit=second&key=AjKsWPmToLkMWJM9vMxh5DgCLDBs7s9-v482h8nW_BjqGH3rcEx-20dZueRS6D5C");
  }

  dohvMesto(username: string) {
    return this.http.get<any[]>(this.url + "/korisnici/pred/" + username);
  }

  uposliKurira(body: Kurir) {
    return this.http.post(this.url + "/kuriri", body);
  }

  izbrisiMagacin2(id: number) {
    return this.http.get(this.url + "/magacin/drugi/" + id);
  }

  naCekanju(body: Narudzbina) {
    return this.http.put(this.url + "/magacin/nar", body);
  }

  dohvProdavnicu2(username: string) {
    return this.http.get<Prodavnica[]>(this.url + "/prodavnica/" + username);
  }

  dohvProizvod(id: number) {
    return this.http.get<Prodavnica[]>(this.url + "/prodavnica/posebno/" + id);
  }

  obrisiProizvod(id: number) {
    return this.http.delete(this.url + "/prodavnica/" + id);
  }

  dodajProizvod(body: Prodavnica) {
    return this.http.post(this.url + "/prodavnica", body);
  }

  dohvStat(id: number) {
    return this.http.get<Statistika[]>(this.url + "/statistika/" + id);
  }

  azurStat(body: Statistika) {
    return this.http.put(this.url + "/statistika", body);
  }

  dodajStat(body: Statistika) {
    return this.http.post(this.url + "/statistika", body);
  }

  promeniLozinku(body: any) {
    return this.http.put(this.url + "/korisnici/sifra", body);
  }

  dodajNarucio(body: Narucio) {
    return this.http.post(this.url + "/narucio", body);
  }

}
