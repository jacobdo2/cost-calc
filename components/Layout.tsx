import { Layout as AntLayout, Space } from "antd";
import { Drawer } from "./Drawer";
import { Typography } from "antd";

const { Title } = Typography;

const { Header, Sider, Content } = AntLayout;

type Props = {
  children: React.ReactNode;
  header?: React.ReactNode;
  title: string | React.ReactNode;
};

export const Layout = ({ children, header, title }: Props) => {
  return (
    <AntLayout>
      <Sider>
        <Drawer />
      </Sider>
      <AntLayout style={{ minHeight: "100vh" }}>
        {header && <Header>{header}</Header>}
        <Content>
          <Space style={{ padding: 24 }} direction="vertical">
            <Title level={2}>{title}</Title>
            {children}
          </Space>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
