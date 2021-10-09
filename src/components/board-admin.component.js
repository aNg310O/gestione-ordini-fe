import React, { Component } from "react";
import AdminComponent from "./admin.component";
import UserService from "../services/user.service";
import { CircularIndeterminate } from "./Loader";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      notload: true,
    };
  }

  componentDidMount() {
    UserService.getAdminBoard().then(
      (response) => {
        this.setState({
          content: response.data,
          notload: false,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    if (notload) {
      return <CircularIndeterminate />;
    } else {
      return <AdminComponent />;
    }
  }
}
