import React from "react";
import { Layout } from "components/Layout";
import { Button, Input, InputNumber, Select, Typography } from "antd";
import { useCompounds } from "query/useCompounds";
import { ProfileItem } from "entity/ProfileItem";
import { useProfile } from "query/useProfile";
import { Profile } from "entity/Profile";
import { useRouter } from "next/router";

const { Option } = Select;
const { Title, Text } = Typography;

type ProfileItemValueKey = "min" | "target" | "max";

export const Create = () => {
  const {
    isLoading,
    data: compounds,
  }: { isLoading: boolean; data: string[] } = useCompounds();
  const [selectedCompounds, setSelectedCompounds]: [
    ProfileItem[],
    any
  ] = React.useState<ProfileItem[]>([]);
  const [name, setName] = React.useState<string>("");
  const { store } = useProfile();
  const router = useRouter();

  const onItemValueChange = (
    name: string,
    value: string | number | undefined,
    which: ProfileItemValueKey
  ) =>
    setSelectedCompounds([
      ...selectedCompounds.map((c) => {
        if (c.name === name) {
          return {
            ...c,
            [which]: value,
          };
        }
        return c;
      }),
    ]);

  const resetForm = () => {
    setSelectedCompounds([]);
    setName("");
  };

  const handleSave = React.useCallback(() => {
    const profile: Profile = store({
      name,
      compounds: selectedCompounds,
    });
    resetForm();
    router.push(`/profile/${profile.name}`);
  }, [name, selectedCompounds]);

  return (
    <Layout title="Create profile">
      <Input
        size="large"
        placeholder="Profile name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <br />
      <Title level={3}>Compounds</Title>
      <Select
        size="large"
        showSearch
        loading={isLoading}
        style={{ width: 200 }}
        placeholder="Add compound"
        optionFilterProp="children"
        onChange={(value) => {
          setSelectedCompounds([
            ...selectedCompounds,
            {
              name: value,
              min: 0,
              target: 0,
              max: 0,
            },
          ]);
        }}
        onFocus={() => {}}
        onBlur={() => {}}
        onSearch={() => {}}
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {compounds?.map((compound) => (
          <Option key={compound} value={compound}>
            {compound}
          </Option>
        ))}
      </Select>
      <br />
      {selectedCompounds.length ? (
        <>
          {selectedCompounds.map(({ name, min, max }) => (
            <Input.Group>
              <Title level={4}>{name}</Title>
              <InputNumber
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => onItemValueChange(name, value, "min")}
                placeholder="Min %"
                size="large"
                style={{ width: "calc(100% / 3)" }}
                value={min}
              />
              <InputNumber
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => onItemValueChange(name, value, "max")}
                size="large"
                style={{ width: "calc(100% / 3)" }}
                value={max}
              />
            </Input.Group>
          ))}
        </>
      ) : (
        <Text>No compounds selected</Text>
      )}
      <br />
      <Button
        onClick={handleSave}
        type="primary"
        size="large"
        disabled={!selectedCompounds.length}
      >
        Create
      </Button>
    </Layout>
  );
};

export default Create;
