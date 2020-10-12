import React from "react";
import { Layout } from "components/Layout";
import { Button, Input, InputNumber, Select, Typography } from "antd";
import { useCompounds } from "query/useCompounds";
import { ProfileItem } from "entity/ProfileItem";
import { useProfile } from "query/useProfile";
import { Profile } from "entity/Profile";
import { useRouter } from "next/router";
import { DeleteOutlined } from "@ant-design/icons";

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

  /** Error state */
  const [nameError, setNameError] = React.useState<string | undefined>();
  const [compoundError, setCompoundError] = React.useState<
    string | undefined
  >();
  const [selectedCompoundError, setSelectedCompoundError] = React.useState<{
    [key: string]: string;
  }>({});
  const { store, profiles } = useProfile();
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

  const validateForm = () => {
    resetValidation();
    let isValid = true;

    /** Empty name */
    if (name === "") {
      setNameError("Please provide name for the profile");
      isValid = false;
    }

    /** Duplicate name */
    if (
      profiles.some((p: Profile) => p.name.toLowerCase() === name.toLowerCase())
    ) {
      setNameError("Profile with that name already exists");
    }

    /** No compounds added */
    if (compounds.length === 0) {
      setCompoundError("Please add at least one compound");
      isValid = false;
    }

    /** Compound value errors */
    let compoundValueErrors = {};
    selectedCompounds.forEach((compound) => {
      if (compound.min === 0 && compound.max === 0) {
        compoundValueErrors = {
          ...compoundValueErrors,
          [compound.name]: "Compound values cannot be 0",
        };

        isValid = false;
      }
    });

    setSelectedCompoundError(compoundValueErrors);

    console.log(selectedCompoundError);

    return isValid;
  };
  const resetForm = () => {
    resetValidation();
    setSelectedCompounds([]);
    setName("");
  };

  const resetValidation = () => {
    setCompoundError(undefined);
    setNameError(undefined);
    setSelectedCompoundError({});
  };

  const handleSave = React.useCallback(() => {
    if (!validateForm()) {
      return;
    }

    const profile: Profile = store({
      name,
      compounds: selectedCompounds,
    });
    resetForm();
    router.push(`/profile/${profile.name}`);
  }, [name, selectedCompounds]);

  const handleRemoveCompound = (name: string) => {
    setSelectedCompounds(selectedCompounds.filter((c) => c.name !== name));
  };

  return (
    <Layout title="Create profile">
      <Input
        size="large"
        placeholder="Profile name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      {nameError && <Text type="danger">{nameError}</Text>}
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
      {compoundError && <Text type="danger">{compoundError}</Text>}
      <br />
      {selectedCompounds.length ? (
        <>
          {selectedCompounds.map(({ name, min, max }) => {
            return (
              <React.Fragment key={name}>
                <Input.Group key={name}>
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
                  <Button
                    style={{ color: "red" }}
                    type="link"
                    onClick={() => handleRemoveCompound(name)}
                    icon={<DeleteOutlined />}
                  />
                </Input.Group>
                {selectedCompoundError[name as any] && (
                  <Text type="danger">
                    {selectedCompoundError[name as any]}
                  </Text>
                )}
              </React.Fragment>
            );
          })}
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
