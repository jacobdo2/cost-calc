import React from "react";
import { useRouter } from "next/router";
import { Profile } from "entity/Profile";
import { Material } from "entity/Material";
import { useProfile } from "query/useProfile";
import { Layout } from "components/Layout";
import { CloseOutlined } from "@ant-design/icons";
import {
  Table,
  Typography,
  Space,
  Statistic,
  Input,
  List,
  Popover,
  Button,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useSearchMaterials } from "query/useSearchMaterials";
import { MaterialSearchResult } from "components/MaterialSearchResult";
import ProfileMaterial from "components/ProfileMaterial";
import { LpModel } from "entity/LpModel";
import { SolverResult } from "entity/SolverResult";
import { saveAs } from "file-saver";

const { Title, Text } = Typography;
const { Search } = Input;
const { Column } = Table;

export const ViewProfile = () => {
  const [profile, setProfile] = React.useState<Profile | undefined>();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearchResultVisible, setIsSearchResultVisible] = React.useState(
    false
  );
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [result, setResult] = React.useState<SolverResult | undefined>();
  const [arePricesSet, setArePricesSet] = React.useState(false);

  const {
    isLoading,
    data: foundMaterials,
    refetch: refetchMaterials,
  } = useSearchMaterials(searchTerm);
  const { getByName, update, remove } = useProfile();
  const {
    query: { name },
    push,
  } = useRouter();

  const resetSearch = React.useCallback(() => {
    setSearchInputValue("");
    setSearchTerm("");
  }, [setSearchTerm]);

  const handleAddMaterial = React.useCallback(
    (material) => {
      profile &&
        setProfile(
          update({
            ...profile,
            materials: [
              ...(profile.materials ? profile.materials : []),
              material,
            ],
          })
        );
    },
    [profile]
  );

  const handleUpdatePrice = React.useCallback(
    (price, material) => {
      profile &&
        setProfile(
          update({
            ...profile,
            materials: profile?.materials?.map((m) => {
              if (m.id === material.id) {
                return {
                  ...m,
                  price,
                };
              }

              return m;
            }),
          })
        );
    },
    [profile]
  );

  const handleDelete = (profile: Profile) => {
    remove(profile);
    message.info(`${profile.name} deleted`);
    push("/profile/create");
  };

  const getModel = (): LpModel => {
    const model: LpModel = {
      optimize: "cost",
      opType: "min",
      constraints: {},
      variables: {},
    };

    // Add constraints
    profile?.compounds.forEach((compound) => {
      model.constraints[compound.name] = {
        min: compound.min,
        max: compound.max,
      };
    });

    // Add materials and price
    profile?.materials?.forEach((material) => {
      profile.compounds.forEach((compound) => {
        const chemical = material.chemicals.find(
          (c) => c.name === compound.name
        );
        if (chemical) {
          model.variables[material.name] = {
            ...model.variables[material.name],
            [compound.name]: Number(chemical.typical) / 100,
          };
        }
      });

      model.variables[material.name].cost = material.price || 0;
    });

    return model;
  };

  const handleRemoveMaterial = (material: Material) => {
    if (profile) {
      profile.materials = profile?.materials?.filter(
        (m) => m.id !== material.id
      );
      update(profile);
    }
  };

  const handleCalculate = async () => {
    const response = await fetch(`${process.env.URL}/api/solve`, {
      method: "post",
      body: JSON.stringify(getModel()),
    });

    setResult(await response.json());
  };

  const handleExport = () => {
    saveAs(
      new Blob([JSON.stringify(getModel())], {
        type: "text/plain;charset=utf-8",
      }),
      `${profile?.name}.json`
    );
  };

  // Find profile by name
  React.useEffect(() => {
    const profile = getByName(name as string);
    setProfile(profile);
    setArePricesSet(!!profile?.materials?.every((m) => !!m.price));
  }, [name]);

  // Update price setting status
  React.useEffect(() => {
    setArePricesSet(!!profile?.materials?.every((m) => !!m.price));
  }, [profile?.materials]);

  // Fetch materials when search term updated
  React.useEffect(() => {
    searchTerm !== "" && refetchMaterials();
  }, [searchTerm]);

  // Display search results
  React.useEffect(() => {
    setIsSearchResultVisible(!!searchTerm);
  }, [searchTerm]);

  return (
    <Layout
      title={profile?.name || "Not found"}
      header={
        <div
          style={{
            position: "relative",
            margin: ".75rem 0 .75rem 0",
            maxWidth: "100%",
            width: "20rem",
          }}
        >
          <Popover
            placement="bottomLeft"
            visible={isSearchResultVisible}
            content={
              <List
                style={{
                  maxHeight: "calc(100vh - 6rem)",
                  minWidth: "16rem",
                  overflow: "auto",
                }}
                loading={isLoading}
                dataSource={foundMaterials}
                itemLayout="horizontal"
                renderItem={(material: Material) => (
                  <MaterialSearchResult
                    material={material}
                    compounds={profile?.compounds}
                    handleAdd={handleAddMaterial}
                    isAdded={profile?.materials?.some(
                      (m) => m.id === material.id
                    )}
                  />
                )}
              />
            }
          >
            <Search
              placeholder="Enter material name"
              enterButton="Search"
              size="large"
              {...(searchTerm !== "" && {
                suffix: <CloseOutlined onClick={() => resetSearch()} />,
              })}
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchInputValue(e.target.value)}
              value={searchInputValue}
            />
          </Popover>
        </div>
      }
    >
      {result && (
        <>
          <Statistic title="Feasible" value={result.feasible ? "Yes" : "No"} />
          {result.feasible && (
            <>
              <Statistic title="Price" value={result.result} />
              <Table
                dataSource={Object.entries(result)
                  .filter(([entryKey]) =>
                    profile?.materials?.some((m) => m.name === entryKey)
                  )
                  .map(([name, fraction]) => ({ name, fraction }))}
                rowKey="name"
              >
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Fraction" dataIndex="fraction" key="fraction" />
              </Table>
            </>
          )}
        </>
      )}

      <div>
        <Button
          disabled={!arePricesSet}
          onClick={handleCalculate}
          type="primary"
          shape="round"
          size="large"
          style={{ marginRight: 8 }}
        >
          {result ? "Re-calculate" : "Calculate"}
        </Button>
        <Button
          onClick={handleExport}
          type="primary"
          shape="round"
          size="large"
          style={{ marginRight: 8 }}
        >
          Export
        </Button>
        <Popconfirm
          placement="bottomRight"
          title={"Are you sure you want to delete this profile?"}
          onConfirm={() => profile && handleDelete(profile)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            danger
            type="primary"
            shape="round"
            icon={<DeleteOutlined />}
            size="large"
          />
        </Popconfirm>
      </div>

      <Space style={{ padding: "16px 0px 8px 0" }}>
        <Title level={4}>Profile</Title>
      </Space>
      <Table dataSource={profile?.compounds} pagination={false} rowKey={"name"}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Minimum" dataIndex="min" key="min" />
        <Column title="Maximum" dataIndex="max" key="max" />
      </Table>
      <Space style={{ padding: "16px 0px 8px 0" }}>
        <Title level={4}>Materials</Title>
      </Space>
      {!profile?.materials?.length ? (
        <Text>Add at least one material</Text>
      ) : (
        <List
          dataSource={profile?.materials}
          itemLayout="horizontal"
          renderItem={(material: Material) => (
            <ProfileMaterial
              handleUpdatePrice={handleUpdatePrice}
              handleRemove={handleRemoveMaterial}
              material={material}
              compounds={profile?.compounds}
            />
          )}
        />
      )}
    </Layout>
  );
};

export default ViewProfile;
