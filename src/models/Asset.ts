import { AssetStatus } from "./AssetStatus";
import { Unit } from "./Unit";
import User from "./User";

export class Asset {
   
   id: string;
   name: string;
   description: string;
   model: string;
   ownerId: string;
   owner?: User;
   imageId: string;
   imageUrl: string;
   status: AssetStatus;
   healthLevel: number;
   unit?: Unit;
   
   createdAt?: Date;
   updatedAt?: Date;
   
   constructor(id: string, name: string, description: string, model: string, ownerId: string, imageUrl: string, healthLevel: number, unit: Unit | undefined, status: AssetStatus, imageId: string) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.model = model;
      this.ownerId = ownerId;
      this.imageUrl = imageUrl;
      this.healthLevel = healthLevel;
      this.unit = unit;
      this.status = status;
      this.imageId = imageId;
   }
   
}
