import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import Logging from "../services/log.service";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Campo obbligatorio!
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Email non valida.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        Nome utente lungo 3-20 caratteri.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        Password lunga 6-40 caratteri.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      successful: false,
      message: "",
      redirect: false,
    };

    //    this.state = {
    //      admin: ["user"],
    //      flag: false,
    //    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.username,
        this.state.email,
        this.state.password,
        this.state.admin
      ).then(
        (response) => {
          this.setState({
            message: response.data.message,
            successful: true,
            redirect: true,
          });
          AuthService.login(this.state.username, this.state.password).then(
            () => {
              this.props.history.push("/");
              window.location.reload();
              console.log(
                `INFO, ${this.state.username}, login.component, user logged in`
              );
              Logging.log(
                "INFO",
                this.state.username,
                "WEB - login.component",
                `user logged in`
              );
            }
          );
          console.log(
            `INFO, "NO USER", register.component, register registrato nuovo utente ${this.state.username}`
          );
          Logging.log(
            "INFO",
            this.state.username,
            "login.component",
            `WEB - utente registrato ${this.state.username}`
          );
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
            redirect: false,
          });
          console.log(
            `ERROR, NO USER, register.component, register errore in registrazione ${resMessage}`
          );
          Logging.log(
            "ERROR",
            "NO USER",
            "register.component",
            `WEB - register errore in registrazione ${resMessage}`
          );
        }
      );
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          {/* <FormControlLabel
        control={<Switch checked={flag} onChange={(e) => this.setState({ admin: e.target.checked ? ["admin"] : ["user"], flag: e.target.checked})} name="checkedA" color="primary" />}
        label="Seleziona per creare un utente ADMIN"
      />
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />*/}
          <h5>Registrati per utilizzare l'app</h5>

          <Form
            onSubmit={this.handleRegister}
            ref={(c) => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Nome Utente</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">
                    Registrati
                  </button>
                </div>
              </div>
            )}

            <button
              class="btn btn-dark btn-outline-warning my-2 my-sm-0"
              type="submit"
            >
              <Link to={"/login"} color="primary">
                Torna al login
              </Link>
            </button>

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                  {this.state.successful ? setTimeout(() => {}, 5000) : ""}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
