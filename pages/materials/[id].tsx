import { Material } from "entity/Material";
import { NextPageContext } from "next";
import { Layout } from "components/Layout";
import { Table } from "antd";

type Props = {
  material: Material;
};

export const MaterialById = ({ material }: Props) => {
  return (
    <Layout title={material.name}>
      <Table
        dataSource={material.chemicals}
        rowKey={"name"}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Minimum %",
            dataIndex: "min",
            key: "min",
          },
          {
            title: "Target %",
            dataIndex: "typical",
            key: "typical",
          },
          {
            title: "Maximum %",
            dataIndex: "first_probe",
            key: "first_probe",
          },
        ]}
      />
    </Layout>
  );
};
MaterialById.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx;

  const response = await fetch(
    `http://localhost:3000/api/materials/get?id=${query.id}`
  );

  const material = await response.json();

  return { material };
};

export default MaterialById;
