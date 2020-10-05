import { Material } from "entity/Material";
import { Layout } from "components/Layout";
import { List, Typography } from "antd";
import Link from "next/link";

type Props = {
  materials: Material[];
};

const { Item } = List;

const { Link: AntLink } = Typography;

export const Materials = ({ materials }: Props) => {
  return (
    <Layout title="Materials">
      {
        <List
          dataSource={materials}
          renderItem={(material: Material) => {
            return (
              <Item key={material.id}>
                <Link href={`/materials/${material.id}`}>
                  <AntLink
                    style={{
                      fontSize: "1.25rem",
                    }}
                  >
                    {material.name}
                  </AntLink>
                </Link>
              </Item>
            );
          }}
        />
      }
    </Layout>
  );
};

Materials.getInitialProps = async () => {
  const materials = await fetch(
    `${process.env.URL}/api/materials`
  ).then((res) => res.json());

  return { materials };
};

export default Materials;
