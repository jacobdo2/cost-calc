export interface Material {
  id: number;
  name: string;
  chemicals: Chemical[];
  price: number | undefined;
}

interface Chemical {
  name: string;
  min: string;
  typical: string;
  first_probe: string;
}
