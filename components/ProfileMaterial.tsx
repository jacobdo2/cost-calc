import { Material } from "entity/Material";
import React from "react";
import { Typography, List, Button } from "antd";
import { useMatchingCompounds } from "utils/useMatchingCompounds";
import { ProfileItem } from "entity/ProfileItem";
import { MatchingCompounds } from "./MatchingCompounds";
import { Input } from "antd";
import Link from "next/link";
import { DeleteOutlined } from "@ant-design/icons";

type Props = {
  material: Material;
  compounds?: ProfileItem[];
  handleUpdatePrice: (price: number, material: Material) => void;
  handleRemove: (material: Material) => void;
};

const { Link: AntLink } = Typography;
const { Item } = List;

export const ProfileMaterial = ({
  material,
  compounds,
  handleUpdatePrice,
  handleRemove,
}: Props) => {
  const matchingCompounds = useMatchingCompounds(material, compounds);
  return (
    <Item key={material.id} style={{ whiteSpace: "nowrap" }}>
      <div>
        <Link href={`/materials/${material.id}`}>
          <AntLink
            style={{
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            {material.name}
          </AntLink>
        </Link>

        <MatchingCompounds
          style={{ marginRight: "1rem" }}
          material={material}
          compounds={matchingCompounds}
        />
      </div>
      <Input
        size="large"
        placeholder="price"
        value={material.price}
        onChange={(e) => handleUpdatePrice(Number(e.target.value), material)}
      />
      <Button
        onClick={() => handleRemove(material)}
        style={{ color: "red", marginLeft: 8 }}
        type="link"
        icon={<DeleteOutlined />}
      />
    </Item>
  );
};

export default ProfileMaterial;
