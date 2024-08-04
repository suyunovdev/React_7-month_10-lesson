import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";
import store from "./redux/store";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css"; // Ant Design CSS fayli to'g'ri import qilingan
import "./index.css"; // Custom CSS (agar bo'lsa)

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ConfigProvider>
      <App />
    </ConfigProvider>
    <ToastContainer />
  </Provider>
);
