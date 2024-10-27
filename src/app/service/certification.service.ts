import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certification } from '../models/certification.model';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root'
})


export class CertificationService {
  private apiUrl = AppConstants.BASE_URL_API + "/certifications";

  constructor(private http: HttpClient) {}

  getCertifications(): Observable<{ code: string; certifications: Certification[] }> {
    return this.http.get<{ code: string; certifications: Certification[] }>(this.apiUrl);
  }
}
