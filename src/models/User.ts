
export default class User {

   id: string;
   name: string;
   createdAt?: Date;
   updatedAt?: Date;
   
   constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
   }
   
}