
export default class Company {

   createdAt?: Date;
   updatedAt?: Date;
   unitCount?: number;
   usersCount?: number;
   
   constructor(
      public name: string,
      public id: string
   ) {}
   
}