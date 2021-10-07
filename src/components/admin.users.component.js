import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../asset/App.css";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { CircularIndeterminate } from "./Loader";
import Logging from "../services/log.service";

const seller = AuthService.getCurrentUser();

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [snackColor, setSnackColor] = useState("teal");
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    getData();
  }, [removed]);

  const getData = async () => {
    try {
      const res = await API.get(`/api/user/findUser`, {
        headers: authHeader(),
      });
      if (res.status === 200) {
        if (seller.roles[0] === "ROLE_ADMIN") {
          setUsers(res.data);
          setLoading(false);
          console.log(
            `INFO, ${seller.username}, admin.users.component, getData all users`
          );
          Logging.log(
            "INFO",
            seller.username,
            "admin.users.component",
            `get all users`
          );
        }
      }
    } catch (e) {
      if (e.message === "Network Error") {
        setLoading(false);
        setSnackColor("red");
        setResult("Non sei connesso ad internet...");
        setOpen(true);
      } else if (e.response.status === 401) {
        setLoading(false);
        setSnackColor("red");
        setResult("Sessione scaduta. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          seller.username,
          "admin.users.component",
          `getData errore ${e.message}`
        );
        console.log(
          `ERROR, ${seller.username}, admin.users.component, getData errore ${e.message}`
        );
      } else if (e.response.status === 403) {
        setLoading(false);
        setSnackColor("red");
        setResult("No token provided. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          seller.username,
          "admin.users.component",
          `getData errore ${e.message}`
        );
        console.log(
          `ERROR, ${seller.username}, admin.users.component, getData errore ${e.message}`
        );
      } else {
        setLoading(false);
        setSnackColor("red");
        setResult(e.message);
        setOpen(true);
        Logging.log(
          "ERROR",
          seller.username,
          "admin.users.component",
          `getData errore ${e.message}`
        );
        console.log(
          `ERROR, ${seller.username}, admin.users.component, getData errore ${e.message}`
        );
      }
    }
  };

  const removeData = (username) => {
    if (username === seller.username) {
      setResult("Non puoi rimuovere te stesso...");
      setSnackColor("orange");
      setOpen(true);
    } else {
      var answer = window.confirm(`Vuoi davvero eliminare l'utente?`);
      setLoading(true);
      setRemoved(!removed);
      if (answer) {
        API.delete(`api/user/deleteUser/${username}`, {
          headers: authHeader(),
        }).then((res) => {
          const del = users.filter((users) => username !== users.username);
          setUsers(del);
          console.log(
            `INFO, ${seller.username}, admin.users.component, removeData user ${username}`
          );
          Logging.log(
            "INFO",
            seller.username,
            "admin.users.component",
            `Eliminazione user ${username}`
          );
        });
      }
      setLoading(false);
    }
  };

  const renderHeader = () => {
    let headerElement = ["username", "email", ""];
    return headerElement.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  const renderBody = () => {
    return (
      users &&
      users.map(({ id, username, email }) => {
        return (
          <tr key={id}>
            <td>{username}</td>
            <td>{email}</td>
            <td className="operation">
              <button className="button" onClick={() => removeData(username)}>
                Elimina
              </button>
            </td>
          </tr>
        );
      })
    );
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  if (!loading) {
    return (
      <div>
        <table id="styled-table">
          <thead>
            <tr>{renderHeader()}</tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <SnackbarContent
            style={{
              backgroundColor: snackColor,
            }}
            message={result}
          />
        </Snackbar>
      </div>
    );
  } else {
    return <CircularIndeterminate />;
  }
};

export { AdminUsersTable };