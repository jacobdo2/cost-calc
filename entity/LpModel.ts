export interface LpModel {
  optimize: string;
  opType: string;
  constraints: {
    [key: string]: {
      min: number;
      max: number;
    };
  };
  variables: {
    [key: string]: {
      [key: string]: number;
    };
  };
}
