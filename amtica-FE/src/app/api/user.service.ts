import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "/api/v1/"
  constructor(private http:HttpClient) { }

  public signupApi(data): Observable<any> {
    const params = new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('email',data.email)
    .set('password',data.password)
    return this.http.post(`${this.baseUrl}users/signup/`,params)
    .pipe(catchError(this.handleErrorApi))
  }
  public loginApi(data): Observable<any> {
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password)
    return this.http.post(`${this.baseUrl}/users/login/`,params)
    .pipe(catchError(this.handleErrorApi))
  }

  public logoutApi(data):Observable<any>{
    const params = new HttpParams()
    .set('userId',data.userId)
    return this.http.post(`${this.baseUrl}/users/logout/`,params)
    .pipe(catchError(this.handleErrorApi))
  }
  
  private handleErrorApi(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  } 
}
