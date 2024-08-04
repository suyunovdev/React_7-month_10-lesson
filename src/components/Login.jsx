import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = values => {
    setLoading(true);
    const { username, password } = values;
    if (username === "ilyos" && password === "333196454") {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ width: "400px" }}>
      <Form name="login" onFinish={handleLogin} className="form">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}>
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
