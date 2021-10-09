import React, { Component } from "react";
import UserService from "../services/user.service";
import { SellerComponent } from "./ordini.component";
import { CircularIndeterminate } from "./Loader";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      notload: true,
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
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
      return <SellerComponent />;
    }
  }
}
