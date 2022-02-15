
import * as axios from 'axios';
import Company from '../models/Company';

class ApiService {

   baseUrl = 'http://challenge-back-end-tractian.herokuapp.com/api/v1'
   
   getCompanies(): Promise<Company[]> {
      return new Promise((resolve, reject) => {
         
         fetch(`${this.baseUrl}/companies`)
         .then(async response => {
            
            const companies: Company[] = [];

            const data = await response.json();
            
            for (const companyObject of data.data) {
               const company = new Company(companyObject.name, companyObject.id);
               company.createdAt = new Date(companyObject.createdAt);
               company.updatedAt = new Date(companyObject.updatedAt);
               companies.push(company);
            }

            resolve(companies);
         })
         .catch(reject);
         
      });
   }

}

export default new ApiService() as ApiService