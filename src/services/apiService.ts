
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

   private performRequest(endpoint: string, method: 'POST' | 'GET' | 'PUT' | 'DELETE', body?: any): Promise<{ status: number, data: any }> {
      return new Promise((resolve, reject) => {
         
         fetch(`${this.baseUrl}${endpoint}`, {
            method,
            body,
            headers: this.headers
         })
         .then(async response => {
            
            const data = await response.json();
            
            if (response.status >= 400) {
               return reject({
                  status: response.status,
                  message: data?.message ?? "Something went wrong"
               })
            }

            resolve({
               status: response.status,
               data: data.data
            });
            
         })
         .catch(err => {
            
            return reject({
               status: 500,
               message: err.message
            });
            
         });
         
      });
   }
   
   getCompanies(): Promise<Company[]> {
      
      return this.performRequest('/companies', 'GET')
      .then(response => {
         return response.data.map((companyData: any) => this.dataToCompany(companyData));
      });
      
   }

   getCompanyById(id: string): Promise<Company> {
      
      return this.performRequest(`/companies/${id}`, 'GET')
      .then(response => {
         return this.dataToCompany(response.data)
      });
      
   }

   createNewCompany(companyName: string): Promise<Company> {
      
      return this.performRequest('/companies', 'POST', JSON.stringify({ name: companyName }))
      .then(response => {
         return this.dataToCompany(response.data)
      });
      
   }

   updateCompany(companyName: string, companyId: string): Promise<Company> {
      
      return this.performRequest(`/companies/${companyId}`, 'PUT', JSON.stringify({ name: companyName }))
      .then(response => {
         return this.dataToCompany(response.data)
      });
      
   }

   deleteCompany(companyId: string): Promise<any> {
      return this.performRequest(`/companies/${companyId}`, 'DELETE');
   }

}

export default new ApiService() as ApiService