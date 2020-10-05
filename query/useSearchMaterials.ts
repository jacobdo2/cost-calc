import { useQuery } from "react-query";

export const useSearchMaterials = (term: string) => {
  return useQuery(
    "searchMaterials",
    () => {
      return fetch(`/api/materials/find?name=${term}`).then((res) =>
        res.json()
      );
    },
    { enabled: false }
  );
};
