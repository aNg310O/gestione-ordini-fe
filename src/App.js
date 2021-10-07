import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "./asset/App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import { SellerComponent } from "./components/ordini.component";
import { RivediOrdineComponent } from "./components/ordine.rivedi.component";
import { RivediOrdineDayComponent } from "./components/ordine.rivedi.day.component";
import { AdminProdotti } from "./components/admin.gestioneprodotti.component";
import { AdminUsers } from "./components/admin.gestioneutenti.component";
import Register from "./components/register.component";
import { AdminReportOggi } from "./components/admin.reportoggi.component";
import { AdminReportAltri } from "./components/admin.altrireport.component";
import { AdminEvent } from "./components/admin.eventlog";
import NotFoundPage from "./components/NotFoundPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({ currentUser: undefined, showAdminBoard: false });
  }

  render() {
    const { currentUser, showAdminBoard } = this.state;

    return (
      <>
        <nav className="navbar navbar-fixed-top">
          <button
            className="navbar-toggler navbar-left"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent1"
            aria-controls="navbarSupportedContent1"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i className="fa-1x"></i>
            </span>
          </button>
          <span className="navbar-text">
            {currentUser ? currentUser.username : "Benvenuto"}
          </span>
          <ul class="nav navbar-nav flex-row justify-content-md-right justify-content-start flex-nowrap text-right">
            {currentUser ? (
              <li className="nav-item">
                <Link
                  to={"/login"}
                  className="nav-link"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                  onClick={this.logOut}
                >
                  Disconnetti
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  to={"/login"}
                  className="nav-link"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
                  Accedi
                </Link>
                <li className="nav-item">
                  <Link
                    to={"/admin/new"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show"
                  >
                    Registrati
                  </Link>
                </li>
              </li>
            )}
          </ul>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent1"
          >
            <ul className="navbar-nav">
              {showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/admin/prodottsplit"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Gestione dei prodotti" })} */
                  >
                    Gestione prodotti
                  </Link>
                </li>
              )}

              {showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/admin/users"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Gestione degli utenti" })} */
                  >
                    Gestione utenti
                  </Link>
                </li>
              )}

              {/*showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/admin/new"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show"
                  >
                    Inserimento utenti
                  </Link>
                </li>
              )*/}
              {currentUser && (
                <li className="nav-item">
                  <Link
                    to={"/user/ordine"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Inserisci ordini" })} */
                  >
                    Inserisci ordine
                  </Link>
                </li>
              )}

              {showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/admin/report/oggi"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Report di oggi" })} */
                  >
                    Report di oggi
                  </Link>
                </li>
              )}

              {showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/admin/report/altri"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Altri report" })} */
                  >
                    Altri report
                  </Link>
                </li>
              )}

              {/*Test per differenziare menu admin/user per la voce rivedi il tuo ordine 
              {currentUser && (
                <li className="nav-item">
                  <Link to={"/user/recap"} className="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.setState({ title: " | Verifica ordine" })}>
                    Rivedi il tuo Ordine
                </Link>
                </li>
              )}*/}

              {currentUser && !showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/user/recap"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Verifica ordine" })} */
                  >
                    Rivedi il tuo Ordine di oggi
                  </Link>
                </li>
              )}

              {currentUser && !showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/user/recapDay"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Verifica ordine" })} */
                  >
                    Rivedi il tuo Ordine di un altro giorno
                  </Link>
                </li>
              )}

              {currentUser && showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/user/recap"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Verifica ordine" })} */
                  >
                    Modifica l'ordine di oggi
                  </Link>
                </li>
              )}

              {showAdminBoard && (
                <li className="nav-item">
                  <Link
                    to={"/admin/event"}
                    className="nav-link"
                    data-toggle="collapse"
                    data-target=".navbar-collapse.show" /* onClick={() => this.setState({ title: " | Altri report" })} */
                  >
                    Event log
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user/ordine" component={SellerComponent} />
            <Route path="/user/recap" component={RivediOrdineComponent} />
            <Route path="/user/recapDay" component={RivediOrdineDayComponent} />
            <Route path="/admin/prodottsplit" component={AdminProdotti} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/new" component={Register} />
            <Route path="/admin/report/oggi" component={AdminReportOggi} />
            <Route path="/admin/report/altri" component={AdminReportAltri} />
            <Route path="/admin/event" component={AdminEvent} />
            <Route path="/404" component={NotFoundPage} />
            <Redirect to="/404" />
          </Switch>
        </div>
      </>
    );
  }
}

export default App;
