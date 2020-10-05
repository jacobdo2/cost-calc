import { Material } from "entity/Material";
import { ProfileItem } from "entity/ProfileItem";
import React from "react";

export const useMatchingCompounds = (
  material: Material,
  targetCompounds: ProfileItem[] = []
) => {
  const [matchingCompounds, setMatchingCompounds] = React.useState<
    ProfileItem[] | undefined
  >([]);
  React.useEffect(() => {
    setMatchingCompounds(
      targetCompounds.filter((compound) =>
        material.chemicals.some((c) => c.name === compound.name)
      )
    );
  }, [material, targetCompounds]);

  return matchingCompounds;
};
