import { Material } from "./Material";
import { ProfileItem } from "./ProfileItem";

export interface Profile {
  name: string;
  compounds: ProfileItem[];
  materials?: Material[];
}
