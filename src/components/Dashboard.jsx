import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import Students from "./Students";
import Teachers from "./Teachers";

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{ position: "fixed", minHeight: "100vh", marginRight: "200px" }}>
        <div className="logo" />
        <Menu theme="dark" mode="inline">
          <Menu.Item key="0">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/students">Students</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/teachers">Teachers</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          {"  Student"}
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Students />
          </div>
        </Content>
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Teachers />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ilyos Suyunov ©2024 Created by Suyunovdev
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
