import { Material } from "entity/Material";
import { ProfileItem } from "entity/ProfileItem";
import React from "react";
import { Typography } from "antd";

type Props = {
  material: Material;
  compounds?: ProfileItem[];
  style?: any;
};

const { Text } = Typography;

export const MatchingCompounds = ({
  compounds = [],
  material,
  style,
  ...rest
}: Props) => {
  return (
    <div style={{ ...style, display: "flex" }} {...rest}>
      {compounds?.length ? (
        compounds.map((compound) => {
          const chemical = material.chemicals.find(
            (c) => c.name === compound.name
          );

          if (chemical) {
            return (
              <div
                key={compound.name}
                style={{ marginRight: 8, display: "flex" }}
              >
                <span style={{ marginRight: 4, fontWeight: "bold" }}>
                  {compound.name}
                </span>
                <span>{chemical.typical}%</span>
              </div>
            );
          }
        })
      ) : (
        <Text>No matching compounds</Text>
      )}
    </div>
  );
};
