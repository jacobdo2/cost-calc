import React from "react";
import { Material } from "entity/Material";
import { Typography, List, Button } from "antd";
import { ProfileItem } from "entity/ProfileItem";
import { useMatchingCompounds } from "utils/useMatchingCompounds";
import { MatchingCompounds } from "./MatchingCompounds";

const { Text } = Typography;

type Props = {
  material: Material;
  compounds?: ProfileItem[];
  handleAdd: (material: Material) => void;
  isAdded?: boolean;
};

export const MaterialSearchResult = ({
  material,
  handleAdd,
  isAdded = false,
  compounds = [],
}: Props) => {
  const matchingCompounds = useMatchingCompounds(material, compounds);

  return (
    <List.Item
      key={material.id}
      actions={[
        <Button
          type="link"
          onClick={() => handleAdd(material)}
          disabled={isAdded}
        >
          {isAdded ? "Added" : "Add"}
        </Button>,
      ]}
    >
      <div>
        <Text style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
          {material.name}
        </Text>
        <MatchingCompounds material={material} compounds={matchingCompounds} />
      </div>
    </List.Item>
  );
};
