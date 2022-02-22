
export default class Company {

   createdAt?: Date;
   updatedAt?: Date;
   unitCount?: number;
   userCount?: number;
   
   constructor(
      public name: string,
      public id: string
   ) {}
   
}