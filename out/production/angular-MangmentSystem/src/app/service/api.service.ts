import {EventEmitter, Injectable} from '@angular/core';
import CryptoJs from "crypto-js"
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as http from "http";



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private  static BASE_URL ="http://localhost:9098/api";
  private static ENCRPTION_KEY = "my-encryption-key";

  authStatusChanged = new EventEmitter<void>();

  constructor(private  http: HttpClient) {}

  encryptAndSaveTpStorage(key:string, value:string):void{
    const  encryptedValue = CryptoJs.AES.encrypt(value,ApiService.ENCRPTION_KEY).toString();
    localStorage.setItem(key, encryptedValue);

  }

  private getFromStorageAndDecrypt(key:string):any{
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null
      return CryptoJs.AES.decrypt(encryptedValue,ApiService.ENCRPTION_KEY).toString(CryptoJs.enc.Utf8)
    }catch (eror){
       return null;
    }
  }
   private clearAuth(){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    }

    private getHeader():HttpHeaders{
    const token = this.getFromStorageAndDecrypt("token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`

    })
    }



    /** AUTH & USERS METHODS */
    registerUser(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/auth/register` ,body);
    }

  loginUser(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/auth/login` ,body);
  }

  getLoggedInUserInfo():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/users/current` ,{
      headers:this.getHeader(),
    });
  }

  /** CATEGORY METHODS*/

  createCategory(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/category/add` , body,{
      headers:this.getHeader(),
    });
  }

  getAllCategory():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/category/all` , {
      headers:this.getHeader(),
    });
  }

  getCategoryById(id:string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/category/${id}` ,{
      headers:this.getHeader(),
    });
  }

  updateCategory(id:string , body:any):Observable<any>{
    return this.http.put(`${ApiService.BASE_URL}/category/update/${id}` , body,{
      headers:this.getHeader(),
    });
  }

  deleteCategory(id:string):Observable<any>{
    return this.http.delete(`${ApiService.BASE_URL}/category/delete/${id}` ,{
      headers:this.getHeader(),
    });
  }

  /** SUPPLIER METHODS*/


  addSupplier(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/supplier/add` , body,{
      headers:this.getHeader(),
    });
  }

  getAllSupplier():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/supplier/all` , {
      headers:this.getHeader(),
    });
  }

  getSupplierById(id:string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/supplier/${id}` ,{
      headers:this.getHeader(),
    });
  }

  updateSupplier(id:string , body:any):Observable<any>{
    return this.http.put(`${ApiService.BASE_URL}/supplier/update/${id}` , body,{
      headers:this.getHeader(),
    });
  }

  deleteSupplier(id:string):Observable<any>{
    return this.http.delete(`${ApiService.BASE_URL}/supplier/delete/${id}` ,{
      headers:this.getHeader(),
    });
  }


  /**PRODUCTS METHODS*/

  addProduct(formData:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/products/add` , formData,{
      headers:this.getHeader(),
    });
  }

  getProductById(id:string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/products/${id}` ,{
      headers:this.getHeader(),
    });
  }
  getAllProducts():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/products/all` , {
      headers:this.getHeader(),
    });
  }

  updateProduct(formData:any):Observable<any>{
    return this.http.put(`${ApiService.BASE_URL}/products/update` , formData,{
      headers: this.getHeader(),
    });
  }

  deleteProduct(id:string):Observable<any>{
    return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}` ,{
      headers: this.getHeader(),
    });
  }

  /**TRANSACTIONS METHODS */

  purchaseProduct(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/transactions/purchase` , body,{
      headers: this.getHeader(),
    });
  }

 sellProduct(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell` , body,{
      headers: this.getHeader(),
    });
  }

  returnToSupplier(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/transactions/return` , body,{
      headers: this.getHeader(),
    });
  }

  getAllTransactions(searchText:string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/transactions/all` , {
      params: { searchText: searchText},
      headers:this.getHeader(),
    });
  }

  getTransactionById(id:string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}` ,{
      headers:this.getHeader(),
    });
  }

  updateTransactionStatus(id:string, status:string):Observable<any>{
    return this.http.put(`${ApiService.BASE_URL}/transactions/update/${id}` , JSON.stringify(status),{
      headers: this.getHeader().set("Content-Type" , "application/json")
    });
  }

  getTransactionByMonthAndYear(month:number,year:number):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/transactions/byMonthAndYear` ,{
      headers:this.getHeader(),
      params: {
        month: month,
        year: year,
      }
    });
  }





    logout():void{
    this.clearAuth();
    }
    isAuthenticated():boolean{
      const token =this.getFromStorageAndDecrypt("token");
      return !!token;
    }

    isAdmin():boolean{
       const role = this.getFromStorageAndDecrypt("role");
       return role === "ADMIN";
    }



}
