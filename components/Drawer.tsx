import { Menu } from "antd";
import React from "react";
import {
  AppstoreAddOutlined,
  LineChartOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { useProfile } from "query/useProfile";
import { Profile } from "entity/Profile";
import Link from "next/link";

const { SubMenu } = Menu;

type PathName = "Home" | "Create Profile" | "Materials";

interface MenuItem {
  name: PathName;
  url: string;
  key: string;
}

export const Drawer = () => {
  const { pathname, push } = useRouter();
  const { profiles } = useProfile();

  const menuItems: MenuItem[] = [
    {
      name: "Home",
      url: "/",
      key: "1",
    },
    {
      name: "Create Profile",
      url: "/profile/create",
      key: "2",
    },
    {
      name: "Materials",
      url: "/materials",
      key: "3",
    },
  ];

  const getPathKey = (path: string): string => {
    return menuItems.find((m: MenuItem) => m.url === path)?.key || "0";
  };

  return (
    <Menu
      style={{ width: "100%" }}
      defaultSelectedKeys={[getPathKey(pathname)]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
    >
      <Menu.Item key={getPathKey("/")} onClick={() => push("/")}>
        <HomeOutlined />
        <span>Home</span>
      </Menu.Item>
      <Menu.Item
        key={getPathKey("/materials")}
        onClick={() => push("/materials")}
      >
        <HomeOutlined />
        <span>Materials</span>
      </Menu.Item>

      <SubMenu key="sub2" icon={<LineChartOutlined />} title="Profiles">
        <Menu.Item
          key={getPathKey("/profile/create")}
          onClick={() => push("/profile/create")}
        >
          <AppstoreAddOutlined />
          <span>Create</span>
        </Menu.Item>
        {profiles?.map((profile: Profile) => (
          <Menu.Item key={profile.name}>
            <Link href="/profile/[name]" as={`/profile/${profile.name}`}>
              <a>{profile.name}</a>
            </Link>
          </Menu.Item>
        ))}
      </SubMenu>
    </Menu>
  );
};
