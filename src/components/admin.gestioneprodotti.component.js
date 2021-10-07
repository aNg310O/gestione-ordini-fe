import React, { useState } from "react";
import API from "../services/api";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { ProductTable } from "./admin.product.component";
import authHeader from "../services/auth-header";
import AuthService from "../services/auth.service";
import Logging from "../services/log.service";

const currentUser = AuthService.getCurrentUser();

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  },
}));

export function AdminProdotti() {
  const classes = useStyles();
  const [desc, setDesc] = useState("");
  const [grammatura, setGrammatura] = useState(0);
  const [pesoTotale, setPesoTotale] = useState(0);
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);
  const [snackColor, setSnackColor] = useState("teal");
  const [reload, setReload] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const handleProductClick = (desc, grammatura, pesoTotale) => {
    if (
      desc !== "" &&
      pesoTotale !== 0 &&
      pesoTotale !== "" &&
      grammatura !== 0 &&
      grammatura !== ""
    ) {
      let data = {
        prodotto: desc,
        pesoTotale: pesoTotale,
        pezzatura: grammatura,
      };
      API.post("gestione-ordini/prodottisplit/", data, {
        headers: authHeader(),
      })
        .then((response) => {
          if (response.status === 200) {
            setDisabled(true);
            setReload(!reload);
            setSnackColor("green");
            setResult("Prodotto inserito!");
            setOpen(true);
            console.log(
              `INFO, ${currentUser.username}, admin.gestioneprodotti.component, handleProductClick inserito prodotto`
            );
            Logging.log(
              "INFO",
              currentUser.username,
              "admin.gestioneprodotti.component",
              `Inserimento nuovo prodotto ${desc, pesoTotale, grammatura}`
            );
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            setSnackColor("red");
            setResult("La tua sessione è scaduta. Fai logout/login!");
            setOpen(true);
            console.log(
              `ERROR, ${currentUser.username}, admin.gestioneprodotti.component, handleProductClick errore ${e.message}`
            );
            Logging.log(
              "ERROR",
              currentUser.username,
              "admin.gestioneprodotti.component",
              `handleProductClick errore ${e.message}`
            );
          } else if (e.response.status === 403) {
            setSnackColor("red");
            setResult("No token provided. Fai logout/login!");
            setOpen(true);
            console.log(
              `ERROR, ${currentUser.username}, admin.gestioneprodotti.component, handleProductClick errore ${e.message}`
            );
            Logging.log(
              "ERROR",
              currentUser.username,
              "admin.gestioneprodotti.component",
              `handleProductClick errore ${e.message}`
            );
          } else {
            setSnackColor("red");
            setResult(e.message);
            setOpen(true);
            console.log(
              `ERROR, ${currentUser.username}, admin.gestioneprodotti.component, handleProductClick errore ${e.message}`
            );
            Logging.log(
              "ERROR",
              currentUser.username,
              "admin.gestioneprodotti.component",
              `handleProductClick errore ${e.message}`
            );
          }
        });
    } else {
      Logging.log(
        "INFO",
        currentUser.username,
        "admin.gestioneprodotti.component",
        `Tentativo inserimento prodotto vuoto`
      );
      setDisabled(true);
      setResult("Il prodotto non può essere vuoto...");
      setSnackColor("orange");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setDisabled(false);
  };

  return (
    <div>
      <Box className={classes.root}>
        <ProductTable reload={reload} />
        <TextField
          required
          label="Prodotto"
          variant="outlined"
          value={desc}
          margin="none"
          type="string"
          onChange={(e) => setDesc(e.target.value)}
          style={{ margin: "20px" }}
        ></TextField>
        <TextField
          required
          label="Peso Totale (gr)"
          variant="outlined"
          value={pesoTotale}
          margin="none"
          type="number"
          onChange={(e) => setPesoTotale(e.target.value)}
          InputProps={{ inputProps: { min: 0 } }}
          style={{ margin: "20px" }}
        ></TextField>
        <TextField
          required
          label="Pezzatura (gr)"
          variant="outlined"
          value={grammatura}
          margin="none"
          type="number"
          onChange={(e) => setGrammatura(e.target.value)}
          InputProps={{ inputProps: { min: 0 } }}
          style={{ margin: "20px" }}
        ></TextField>
        <Button
          onClick={() => handleProductClick(desc, grammatura, pesoTotale)}
          size="large"
          disabled={disabled}
          style={{
            display: "flex",
            backgroundColor: "#ff3d00",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px",
          }}
          startIcon={<CloudUploadIcon />}
          variant="outlined"
        >
          Inserisci nuovo prodotto
        </Button>
      </Box>

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
}