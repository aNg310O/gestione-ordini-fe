import React, { Component } from "react";
import UserService from "../services/user.service";
import { CircularIndeterminate } from "./Loader";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      notload: true,
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      (response) => {
        this.setState({
          content: response.data,
          notload: false,
        });
      },

      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    if (this.notload) {
      return (
        <div className="container">
          <CircularIndeterminate />;
        </div>
      );
    } else {
      return (
        <div className="container">
          <header className="jumbotron bg-dark">
            <h6>Benvenuto. Gestisci i tuoi ordini da questa app!</h6>
          </header>
        </div>
      );
    }
  }
}
