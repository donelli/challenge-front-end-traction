import { Unit } from './../models/Unit';
import { Asset } from './../models/Asset';

import Company from '../models/Company';
import User from '../models/User';
import { AssetStatus } from '../models/AssetStatus';

class ApiService {

   baseUrl = 'https://challenge-back-end-tractian.herokuapp.com/api/v1'

   headers: Headers;
   
   constructor() {
      this.headers = new Headers();
      this.headers.append("Content-Type", "application/json");
   }
   
   private dataToCompany(data: any): Company {
      
      const company = new Company(data.name, data.id);
      company.createdAt = new Date(data.createdAt);
      company.updatedAt = new Date(data.updatedAt);

      company.unitCount = data.unitCount;
      company.userCount = data.userCount;

      return company;
   }

   private dataToUser(data: any): User {
      
      const user = new User(data.id, data.name);
      user.createdAt = new Date(data.createdAt);
      user.updatedAt = new Date(data.updatedAt);
      
      return user;
   }

   private dataToUnit(data: any): Unit {
      const unit = new Unit(data.id, data.name);

      unit.createdAt = new Date(data.createdAt);
      unit.updatedAt = new Date(data.updatedAt);
      
      return unit;
   }

   private dataToAsset(data: any): Asset {

      let unit: Unit | undefined;
      
      if (data.unit) {
         unit = this.dataToUnit(data.unit);
      }
      
      const asset = new Asset(data.id, data.name, data.description, data.model, data.owner, data.image, data.health_level, unit, data.status as AssetStatus, data.imageId);
      asset.updatedAt = data.updatedAt;
      asset.createdAt = data.createdAt;
      
      return asset;
   }

   private assetToReqBody(asset: Asset) {
      return {
         name: asset.name,
         description: asset.description,
         model: asset.model,
         ownerId: asset.ownerId,
         imageId: asset.imageId,
         healthLevel: asset.healthLevel,
         status: asset.status
      };
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

   getAssetsFromCompany(companyId: string): Promise<Asset[]> {
      
      return this.performRequest(`/companies/${companyId}/assets`, 'GET')
      .then(response => {
         return response.data.map((data: any) => this.dataToAsset(data));
      });
      
   }

   getAssetStatusSummary(id: string): Promise<{ status: string, count: number }[]> {
      
      return this.performRequest(`/companies/${id}/assets/status`, 'GET')
      .then(response => {
         return response.data;
      });
      
   }

   getUsers(id: string): Promise<User[]> {
      
      return this.performRequest(`/companies/${id}/users`, 'GET')
      .then(response => {
         return response.data.map((data: any) => this.dataToUser(data));
      });
      
   }

   getUserById(companyId: string, userId: string): Promise<User> {
      
      return this.performRequest(`/companies/${companyId}/users/${userId}`, 'GET')
      .then(response => {
         return this.dataToUser(response.data);
      });
      
   }

   createNewUser(companyId: string, userName: string): Promise<User> {
      
      return this.performRequest(`/companies/${companyId}/users`, 'POST', JSON.stringify({ name: userName }))
      .then(response => {
         return this.dataToUser(response.data)
      });
      
   }

   updateUser(companyId: string, userId: string, userName: string): Promise<User> {
      
      return this.performRequest(`/companies/${companyId}/users/${userId}`, 'PUT', JSON.stringify({ name: userName }))
      .then(response => {
         return this.dataToUser(response.data)
      });
      
   }

   deleteUser(companyId: string, userId: string): Promise<any> {
      return this.performRequest(`/companies/${companyId}/users/${userId}`, 'DELETE');
   }

   getUnits(companyId: string): Promise<Unit[]> {
      
      return this.performRequest(`/companies/${companyId}/units`, 'GET')
      .then(response => {
         return response.data.map((data: any) => this.dataToUnit(data));
      });
      
   }

   getUnitById(companyId: string, unitId: string): Promise<Unit> {
      
      return this.performRequest(`/companies/${companyId}/units/${unitId}`, 'GET')
      .then(response => {
         return this.dataToUnit(response.data);
      });
      
   }

   createNewUnit(companyId: string, unitName: string): Promise<Unit> {
      
      return this.performRequest(`/companies/${companyId}/units`, 'POST', JSON.stringify({ name: unitName }))
      .then(response => {
         return this.dataToUnit(response.data)
      });
      
   }

   updateUnit(companyId: string, unitId: string, unitName: string): Promise<Unit> {
      
      return this.performRequest(`/companies/${companyId}/units/${unitId}`, 'PUT', JSON.stringify({ name: unitName }))
      .then(response => {
         return this.dataToUnit(response.data)
      });
      
   }

   deleteUnit(companyId: string, unitId: string): Promise<any> {
      return this.performRequest(`/companies/${companyId}/units/${unitId}`, 'DELETE');
   }
   
   getAssets(companyId: string, unitId: string): Promise<Asset[]> {
      
      return this.performRequest(`/companies/${companyId}/units/${unitId}/assets`, 'GET')
      .then(response => {
         return response.data.map((data: any) => this.dataToAsset(data));
      });
      
   }

   getAssetById(companyId: string, unitId: string, assetId: string): Promise<Asset> {
      
      return this.performRequest(`/companies/${companyId}/units/${unitId}/assets/${assetId}`, 'GET')
      .then(response => {
         return this.dataToAsset(response.data);
      });
      
   }

   createNewAsset(companyId: string, unitId: string, asset: Asset): Promise<Asset> {
      
      return this.performRequest(`/companies/${companyId}/units/${unitId}/assets`, 'POST', JSON.stringify(this.assetToReqBody(asset)))
      .then(response => {
         return this.dataToAsset(response.data)
      });
      
   }

   updateAsset(companyId: string, unitId: string, asset: Asset): Promise<Asset> {
      
      return this.performRequest(`/companies/${companyId}/units/${unitId}/assets/${asset.id}`, 'PUT', JSON.stringify(this.assetToReqBody(asset)))
      .then(response => {
         return this.dataToAsset(response.data)
      });
      
   }

   deleteAsset(companyId: string, unitId: string, assetId: string): Promise<any> {
      return this.performRequest(`/companies/${companyId}/units/${unitId}/assets/${assetId}`, 'DELETE');
   }

   getAssetUploadUrl() {
      return `${this.baseUrl}/uploadAssetImage`;
   }

   getImageErrorFallback() {
      return 'https://www.iconpacks.net/icons/1/free-error-icon-905-thumb.png';
   }
   
}

export default new ApiService() as ApiService