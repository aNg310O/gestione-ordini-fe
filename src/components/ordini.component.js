import React, { useState, useEffect } from "react";
import API from "../services/api";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import { CircularIndeterminate } from "./Loader";
import Logging from "../services/log.service";
import qs from "qs";

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

export function SellerComponent() {
  const classes = useStyles();
  const [prodottos, setProdottos] = useState([]);
  const [pesos, setPesos] = useState([]);
  const [pezzaturas, setPezzaturas] = useState([]);
  const [prodotto, setProdotto] = useState();
  const [peso, setPeso] = useState();
  const [pezzatura, setPezzatura] = useState();
  const [boxVisibility, setBoxVisiblity] = useState("none");
  const [boxVisibilityPeso, setBoxVisiblityPeso] = useState("none");
  const [boxVisibilityPezzatura, setBoxVisiblityPezzatura] = useState("none");
  const [boxCustomVisibility, setBoxCustomVisiblity] = useState("none");
  const [order, setOrder] = useState();
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);
  const [prodottoCustom, setProdottoCustom] = useState("");
  const [ordine, setOrdine] = useState();
  const [note, setNote] = useState("");
  const [pesoTotaleCustom, setPesoTotaleCustom] = useState();
  const [snackColor, setSnackColor] = useState("teal");
  const [loading, setLoading] = useState(true);
  const [loadingPeso, setLoadingPeso] = useState(false);
  const [loadingPezzatura, setLoadingPezzatura] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    retrieveProduct();
  }, []);

  const retrieveProduct = async () => {
    try {
      const response = await API.get("gestione-ordini/prodottisplit", {
        headers: authHeader(),
      });
      if (response.status === 200) {
        setProdottos(response.data);
        setLoading(false);
        console.log(
          `INFO, ${currentUser.username}, ordini.component, retrieveProduct() Call OK`
        );
        Logging.log(
          "INFO",
          currentUser.username,
          "ordini.component",
          "retrieveProduct() Call OK"
        );
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
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrieveProduct() Call KO ${e.message}`
        );
      } else if (e.response.status === 403) {
        setLoading(false);
        setSnackColor("red");
        setResult("No token provided. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrieveProduct() Call KO ${e.message}`
        );
      } else {
        setLoading(false);
        setSnackColor("red");
        setResult(e.message);
        setOpen(true);
        Logging.log(
          "ERROR",
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrieveProduct() Call KO ${e.message}`
        );
      }
    }
  };

  const retrievePeso = async (prodotto) => {
    try {
      const response = await API.get(`gestione-ordini/pesosplit/${prodotto}`, {
        headers: authHeader(),
      });
      if (response.status === 200) {
        setPesos(response.data);
        setLoadingPeso(false);
        console.log(
          `INFO, ${currentUser.username}, ordini.component, retrievePeso() Call OK`
        );
        Logging.log(
          "INFO",
          currentUser.username,
          "ordini.component",
          "retrievePeso() Call OK"
        );
      }
    } catch (e) {
      if (e.message === "Network Error") {
        setLoadingPeso(false);
        setSnackColor("red");
        setResult("Non sei connesso ad internet...");
        setOpen(true);
      } else if (e.response.status === 401) {
        setLoadingPeso(false);
        setSnackColor("red");
        setResult("Sessione scaduta. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrievePeso() Call KO ${e.message}`
        );
      } else if (e.response.status === 403) {
        setLoadingPeso(false);
        setSnackColor("red");
        setResult("No token provided. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrievePeso() Call KO ${e.message}`
        );
      } else {
        setLoadingPeso(false);
        setSnackColor("red");
        setResult(e.message);
        setOpen(true);
        Logging.log(
          "ERROR",
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrievePeso() Call KO ${e.message}`
        );
      }
    }
  };
  const retrievePezzatura = async (peso, prodotto) => {
    try {
      const response = await API.get(`gestione-ordini/pezzaturasplit/`, {
        headers: authHeader(),
        params: {
          peso: peso,
          prodotto: prodotto,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      if (response.status === 200) {
        setPezzaturas(response.data);
        setLoadingPezzatura(false);
        console.log(
          `INFO, ${currentUser.username}, ordini.component, retrievePezzatura() Call OK`
        );
        Logging.log(
          "INFO",
          currentUser.username,
          "ordini.component",
          "retrievePezzatura() Call OK"
        );
      }
    } catch (e) {
      if (e.message === "Network Error") {
        setLoadingPezzatura(false);
        setSnackColor("red");
        setResult("Non sei connesso ad internet...");
        setOpen(true);
      } else if (e.response.status === 401) {
        setLoadingPezzatura(false);
        setSnackColor("red");
        setResult("Sessione scaduta. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrievePezzatura() Call KO ${e.message}`
        );
      } else if (e.response.status === 403) {
        setLoadingPezzatura(false);
        setSnackColor("red");
        setResult("No token provided. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrievePezzatura() Call KO ${e.message}`
        );
      } else {
        setLoadingPezzatura(false);
        setSnackColor("red");
        setResult(e.message);
        setOpen(true);
        Logging.log(
          "ERROR",
          currentUser.username,
          "ordini.component",
          `retrieveProduct() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${currentUser.username}, ordini.component, retrievePezzatura() Call KO ${e.message}`
        );
      }
    }
  };
  const handleChange = (event) => {
    console.log(
      `INFO, ${
        currentUser.username
      }, ordini.component, handleChange() scelto prodotto ${
        event.target.value === 2 ? "Custom" : event.target.value
      }`
    );
    Logging.log(
      "INFO",
      currentUser.username,
      "ordini.component",
      `scelto prodotto ${
        event.target.value === 2 ? "Custom" : event.target.value
      }`
    );
    if (event.target.value !== 2 && event.target.value !== "Ricotta") {
      setLoadingPeso(true);
      setPeso();
      setPezzatura();
      setPesos();
      setPezzaturas();
      setProdotto(event.target.value || "");
      retrievePeso(event.target.value);
      setBoxVisiblityPeso("block");
      setBoxVisiblityPezzatura("none");
      setBoxCustomVisiblity("none");
      setBoxVisiblity("none");
      setOrdine("");
      setNote("");
      setProdottoCustom("");
      setPesoTotaleCustom("");
      setOrder("");
    } else if (event.target.value === "Ricotta") {
      setLoadingPezzatura(true);
      retrievePezzatura(0, event.target.value);
      setProdotto(event.target.value || "");
      setOrder();
      setPeso();
      setBoxVisiblity("none");
      setBoxVisiblityPezzatura("block");
      setBoxVisiblityPeso("none");
      setBoxCustomVisiblity("none");
      setOrdine("");
      setNote("");
      setProdottoCustom("");
      setPesoTotaleCustom("");
      setOrder("");
    } else {
      setProdotto(event.target.value || "");
      setBoxVisiblity("none");
      setBoxVisiblityPezzatura("none");
      setBoxVisiblityPeso("none");
      setBoxCustomVisiblity("block");
      setOrdine("");
      setNote("");
      setProdottoCustom("");
      setPesoTotaleCustom("");
      setOrder("");
    }
  };

  const handleChangePeso = (event) => {
    console.log(
      `INFO, ${
        currentUser.username
      }, ordini.component, handleChangePeso() scelto peso busta ${
        event.target.value === 2 ? "Custom" : event.target.value
      }`
    );
    Logging.log(
      "INFO",
      currentUser.username,
      "ordini.component",
      `scelto peso busta ${
        event.target.value === 2 ? "Custom" : event.target.value
      }`
    );
    setLoadingPezzatura(true);
    setPeso(event.target.value || "");
    setPezzatura();
    retrievePezzatura(event.target.value, prodotto);
    setBoxVisiblityPezzatura("block");
    setBoxVisiblity("none");
    setBoxCustomVisiblity("none");
    setOrdine("");
    setNote("");
    setProdottoCustom("");
    setPesoTotaleCustom("");
    setOrder("");
  };

  const handleChangePezzatura = (event) => {
    console.log(
      `INFO, ${
        currentUser.username
      }, ordini.component, handleChangePezzatura() scelta pezzatura ${
        event.target.value === 2 ? "Custom" : event.target.value
      }`
    );
    Logging.log(
      "INFO",
      currentUser.username,
      "ordini.component",
      `scelta pezzatura ${
        event.target.value === 2 ? "Custom" : event.target.value
      }`
    );
    setPezzatura(event.target.value || "");
    setBoxVisiblity("block");
    setBoxCustomVisiblity("none");
    setOrdine("");
    setNote("");
    setProdottoCustom("");
    setPesoTotaleCustom("");
    setOrder("");
  };
  const handleClick = (prodotto, pesoTotale, pezzatura, note) => {
    if (order !== "0" && order !== "" && order !== null) {
      setDisabled(true);
      let data = {
        desc: prodotto,
        seller: currentUser.username,
        pesoTotale: pesoTotale * order,
        qty: order,
        grammatura: pezzatura,
        pesoProdotto: pesoTotale,
        note: note,
        isCustom: false,
      };
      API.post("gestione-ordini/ordine/", data, { headers: authHeader() })
        .then((response) => {
          if (response.status === 200) {
            setSnackColor("green");
            setResult("Ordine inserito!");
            setOpen(true);
            console.log(
              `INFO, ${currentUser.username}, ordini.component, handleClick inserito prodotto`
            );
            Logging.log(
              "INFO",
              currentUser.username,
              "ordini.component",
              `inserito ordine ${prodotto}, quantita: ${qty} peso totale: ${pesoTotale}, pezzatura: ${pezzatura}`
            );
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            setSnackColor("red");
            setResult("La tua sessione è scaduta. Fai logout/login!");
            setOpen(true);
            Logging.log(
              "ERROR",
              currentUser.username,
              "ordini.component",
              `handleClick errore ${e.message}`
            );
            console.log(
              `ERROR, ${currentUser.username}, ordini.component, handleClick errore ${e.message}`
            );
          } else if (e.response.status === 403) {
            setSnackColor("red");
            setResult("No token provided. Fai logout/login!");
            setOpen(true);
            Logging.log(
              "ERROR",
              currentUser.username,
              "ordini.component",
              `handleClick errore ${e.message}`
            );
            console.log(
              `ERROR, ${currentUser.username}, ordini.component, handleClick errore ${e.message}`
            );
          } else {
            setSnackColor("red");
            setResult(e.message);
            setOpen(true);
            Logging.log(
              "ERROR",
              currentUser.username,
              "ordini.component",
              `handleClick errore ${e.message}`
            );
            console.log(
              `ERROR, ${currentUser.username}, ordini.component, handleClick errore ${e.message}`
            );
          }
        });
    } else {
      setDisabled(true);
      setSnackColor("orange");
      setResult("L'ordine non può essere vuoto...");
      setOpen(true);
    }
  };

  const handleCustomClick = (
    prodottoCustom,
    pesoTotaleCustom,
    ordine,
    note
  ) => {
    if (
      ordine !== "0" &&
      ordine !== "" &&
      prodottoCustom !== "" &&
      pesoTotaleCustom !== "0"
    ) {
      setDisabled(true);
      let customData = {
        desc: prodottoCustom,
        seller: currentUser.username,
        pesoTotale: pesoTotaleCustom,
        qty: ordine,
        note: note,
        isCustom: true,
      };
      API.post("gestione-ordini/ordine/", customData, { headers: authHeader() })
        .then((response) => {
          if (response.status === 200) {
            setSnackColor("green");
            setResult("Ordine custom inserito!");
            setOpen(true);
            console.log(
              `INFO, ${currentUser.username}, ordini.component, handleCustomClick inserito prodotto`
            );
            Logging.log(
              "INFO",
              currentUser.username,
              "ordini.component",
              `inserito ordine personalizzato ${prodottoCustom}, pesoTotale: ${pesoTotaleCustom}`
            );
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            setSnackColor("red");
            setResult("La tua sessione è scaduta. Fai logout/login!");
            setOpen(true);
            Logging.log(
              "ERROR",
              currentUser.username,
              "ordini.component",
              `handleCustomClick errore ${e.message}`
            );
            console.log(
              `ERROR, ${currentUser.username}, ordini.component, handleCustomClick errore ${e.message}`
            );
          } else if (e.response.status === 403) {
            setSnackColor("red");
            setResult("No token provided. Fai logout/login!");
            setOpen(true);
            Logging.log(
              "ERROR",
              currentUser.username,
              "ordini.component",
              `handleCustomClick errore ${e.message}`
            );
            console.log(
              `ERROR, ${currentUser.username}, ordini.component, handleCustomClick errore ${e.message}`
            );
          } else {
            setSnackColor("red");
            setResult(e.message);
            setOpen(true);
            Logging.log(
              "ERROR",
              currentUser.username,
              "ordini.component",
              `handleCustomClick errore ${e.message}`
            );
            console.log(
              `ERROR, ${currentUser.username}, ordini.component, handleCustomClick errore ${e.message}`
            );
          }
        });
    } else {
      setDisabled(true);
      setSnackColor("orange");
      setResult(
        "Devi inserire tutti i campi obbligatori [Nome prodotto, Peso Totale, Quantità]"
      );
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

  if (!loading) {
    return (
      <div>
        <Box className={classes.root}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Prodotto</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={prodotto}
              onChange={handleChange}
            >
              {prodottos &&
                prodottos.map((myData) => (
                  <MenuItem value={myData} key={myData}>
                    {myData}
                  </MenuItem>
                ))}
              <MenuItem value={2} key={"custom"}>
                Ordine personalizzato
              </MenuItem>
            </Select>
          </FormControl>
          {loadingPeso ? (
            <CircularIndeterminate />
          ) : (
            <Box display={boxVisibilityPeso} className={classes.root}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Peso</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={peso}
                  onChange={handleChangePeso}
                >
                  {pesos &&
                    pesos.map((myData) => (
                      <MenuItem value={myData} key={myData}>
                        {myData}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {loadingPezzatura ? (
            <CircularIndeterminate />
          ) : (
            <Box display={boxVisibilityPezzatura} className={classes.root}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Pezzatura</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={pezzatura}
                  onChange={handleChangePezzatura}
                >
                  {pezzaturas &&
                    pezzaturas.map((myData) => (
                      <MenuItem value={myData} key={myData}>
                        {myData}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          )}
          <Box display={boxVisibility} className={classes.root}>
            <TextField
              label="Peso Totale (gr)"
              style={{ backgroundColor: "#5C5C5C", margin: "10px" }}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              variant="outlined"
              value={prodotto !== "Ricotta" ? (order ? peso * order : 0) : ""}
            ></TextField>
            <TextField
              label="Inserisci qui l'ordine"
              style={{ margin: "10px" }}
              margin="none"
              onChange={(e) => setOrder(e.target.value)}
              value={order}
              type="number"
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
            ></TextField>
            <TextField
              label="Note"
              style={{ margin: "10px" }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              margin="none"
              type="string"
              variant="outlined"
            ></TextField>

            <Button
              onClick={() => handleClick(prodotto, peso, pezzatura, note)}
              disabled={disabled}
              size="large"
              style={{
                display: "flex",
                backgroundColor: "#F35B04",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
              startIcon={<CloudUploadIcon />}
              variant="outlined"
            >
              Inserisci ordine
            </Button>
          </Box>
          <Box display={boxCustomVisibility} className={classes.root}>
            <TextField
              required
              value={prodottoCustom}
              style={{ margin: "10px" }}
              margin="none"
              onChange={(e) => setProdottoCustom(e.target.value)}
              type="string"
              variant="outlined"
              label="Nome prodotto"
            ></TextField>
            <TextField
              required
              value={pesoTotaleCustom}
              style={{ margin: "10px" }}
              margin="none"
              onChange={(e) => setPesoTotaleCustom(e.target.value)}
              type="number"
              variant="outlined"
              label="Peso totale(gr)"
              InputProps={{ inputProps: { min: 0 } }}
            ></TextField>
            <TextField
              required
              value={ordine}
              style={{ margin: "10px" }}
              margin="none"
              onChange={(e) => setOrdine(e.target.value)}
              type="number"
              variant="outlined"
              label="Quantità(pezzi)"
              InputProps={{ inputProps: { min: 0 } }}
            ></TextField>
            <TextField
              value={note}
              style={{ margin: "10px" }}
              margin="none"
              onChange={(e) => setNote(e.target.value)}
              type="string"
              variant="outlined"
              label="Note"
            ></TextField>
            <Button
              onClick={() =>
                handleCustomClick(
                  prodottoCustom,
                  pesoTotaleCustom,
                  ordine,
                  note
                )
              }
              disabled={disabled}
              size="large"
              style={{
                display: "flex",
                backgroundColor: "#F35B04",
                alignItems: "center",
                justifyContent: "center",
                "margin-top": "10px",
              }}
              startIcon={<CloudUploadIcon />}
              variant="outlined"
            >
              Inserisci ordine personalizzato
            </Button>
          </Box>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={2000}
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
}
