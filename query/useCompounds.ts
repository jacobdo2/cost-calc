import { useQuery } from "react-query";

export const useCompounds = () => {
  return useQuery("getCompounds", () => {
    return fetch("/api/compounds").then((res) => res.json());
  });
};
