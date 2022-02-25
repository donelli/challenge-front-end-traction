import { Asset } from "./Asset";

export class Unit {
   
   id: string;
   name: string;
   assets: Asset[] = [];
   createdAt?: Date;
   updatedAt?: Date;
   
   constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
   }
   
}
