import React from "react";
import { Profile } from "entity/Profile";
import { useQuery } from "react-query";

export const useProfile = () => {
  const { isLoading, data: profiles, refetch } = useQuery("getProfiles", () => {
    return JSON.parse(localStorage.getItem("profiles") || "[]");
  });

  const getByName = React.useCallback(
    (name: string): Profile | undefined => {
      return profiles?.find((profile: Profile) => profile.name === name);
    },
    [profiles]
  );

  const store = (profile: Profile) => {
    localStorage.setItem(
      "profiles",
      JSON.stringify([
        ...profiles,
        {
          ...profile,
        },
      ])
    );
    refetch();

    return profile;
  };

  const update = (profile: Profile) => {
    const updatedProfiles = profiles.map((p: Profile) =>
      p.name === profile.name ? profile : p
    );

    localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
    refetch();

    return profile;
  };

  const remove = (profile: Profile) => {
    localStorage.setItem(
      "profiles",
      JSON.stringify(profiles.filter((p: Profile) => p.name !== profile.name))
    );

    refetch();
  };

  return {
    isLoading,
    profiles,
    store,
    update,
    getByName,
    remove,
  };
};
