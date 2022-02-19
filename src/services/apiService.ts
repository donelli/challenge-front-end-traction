
import * as axios from 'axios';
import Company from '../models/Company';

class ApiService {

   baseUrl = 'http://challenge-back-end-tractian.herokuapp.com/api/v1'

   headers: Headers;
   
   constructor() {
      this.headers = new Headers();
      this.headers.append("Content-Type", "application/json");
   }
   
   private dataToCompany(data: any): Company {
      
      const company = new Company(data.name, data.id);
      company.createdAt = new Date(data.createdAt);
      company.updatedAt = new Date(data.updatedAt);

      return company;
   }
   
   getCompanies(): Promise<Company[]> {
      return new Promise((resolve, reject) => {
         
         fetch(`${this.baseUrl}/companies`)
         .then(async response => {
            
            const companies: Company[] = [];

            const data = await response.json();
            
            for (const companyObject of data.data) {
               const company = this.dataToCompany(companyObject);
               companies.push(company);
            }

            resolve(companies);
         })
         .catch(reject);
         
      });
   }

   getCompanyById(id: string): Promise<Company> {
      return new Promise((resolve, reject) => {

         fetch(`${this.baseUrl}/companies/${id}`)
         .then(async response => {

            const data = await response.json();
            const companyData = data.data;
            
            const company = this.dataToCompany(companyData);
            
            resolve(company);
            
         })
         .catch((err) => {
            console.log(err);
            reject(err);
         });
         
      });
   }

   createNewCompany(companyName: string): Promise<Company> {
      return new Promise((resolve, reject) => {

         fetch(`${this.baseUrl}/companies`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ name: companyName })
         })
         .then(async response => {
            
            const data = await response.json();
            
            if (response.status === 201) {    // Created
               
               const companyData = data.data;
               const company = this.dataToCompany(companyData);
               
               return resolve(company);
            }
            
            reject(data);
            
         })
         .catch((err) => {
            reject(err);
         });
         
      });
   }

   updateCompany(companyName: string, companyId: string): Promise<Company> {
      return new Promise((resolve, reject) => {

         fetch(`${this.baseUrl}/companies/${companyId}`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({ name: companyName })
         })
         .then(async response => {
            
            const data = await response.json();
            
            if (response.status === 200) {
               
               const companyData = data.data;
               const company = this.dataToCompany(companyData);
               
               return resolve(company);
            }
            
            reject(data);
            
         })
         .catch((err) => {
            console.log(err);
            reject(err);
         });
         
      });
   }

   deleteCompany(companyId: string): Promise<null> {
      return new Promise((resolve, reject) => {

         fetch(`${this.baseUrl}/companies/${companyId}`, {
            method: 'DELETE',
            headers: this.headers
         })
         .then(async response => {
            
            if (response.status === 200) {
               resolve(null);
            } else {
               const data = await response.json();
               reject(data)
            }
            
         })
         .catch((err) => {
            reject(err);
         });
         
      });
   }

}

export default new ApiService() as ApiService