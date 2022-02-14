
import * as axios from 'axios';
import Company from '../models/Company';

class ApiService {

   baseUrl = 'http://challenge-back-end-tractian.herokuapp.com/api/v1/'
   axios: axios.Axios;
   
   constructor() {
      this.axios = new axios.Axios({
         baseURL: this.baseUrl,
         transformResponse: (res) => {
            return res ? JSON.parse(res) : res;
         }
      });
   }

   getCompanies(): Promise<Company[]> {
      return new Promise((resolve, reject) => {
         
         this.axios.get('/companies')
         .then(response => {
            
            const companies: Company[] = [];
            
            for (const companyObject of response.data.data) {
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