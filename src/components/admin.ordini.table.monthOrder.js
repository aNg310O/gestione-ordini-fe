import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../asset/App.css";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Plugins, FilesystemDirectory } from "@capacitor/core";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Typography from "@material-ui/core/Typography";
import {
  isChrome,
  isFirefox,
  isSafari,
  isOpera,
  isIE,
  isEdge,
  isYandex,
  isChromium,
  isMobileSafari,
} from "react-device-detect";
import Logging from "../services/log.service";
import { CircularIndeterminate } from "./Loader";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const { Toast } = Plugins;
const seller = AuthService.getCurrentUser();

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

const AdminMonthOrder = () => {
  const classes = useStyles();
  const [ordine, setOrdine] = useState([]);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);
  const [snackColor, setSnackColor] = useState("teal");
  const [click, setClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [msg, setMsg] = useState("");
  const [tests, setTests] = useState([]);
  const [yearMonth, setyearMonth] = useState();

  //const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    retrieveMonth();
  }, [empty]);

  const retrieveMonth = async () => {
    try {
      const response = await API.get("gestione-ordine/availableMonth", {
        headers: authHeader(),
      });
      if (response.status === 200) {
        setTests(response.data);
        setLoading(false);
        console.log(
          `INFO, ${seller.username}, ordini.table.monthOrder.component, retrieveMonth() Call OK`
        );
        Logging.log(
          "INFO",
          seller.username,
          "ordini.table.monthOrder.component",
          "retrieveMonth() Call OK"
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
          seller.username,
          "ordini.table.monthOrder.component",
          `retrieveMonth() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${seller.username}, ordini.table.monthOrder.component, retrieveMonth() Call KO ${e.message}`
        );
      } else if (e.response.status === 403) {
        setLoading(false);
        setSnackColor("red");
        setResult("No token provided. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          seller.username,
          "ordini.table.monthOrder.component",
          `retrieveMonth() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${seller.username}, ordini.table.monthOrder.component, retrieveMonth() Call KO ${e.message}`
        );
      } else {
        setLoading(false);
        setSnackColor("red");
        setResult(e.message);
        setOpen(true);
        Logging.log(
          "ERROR",
          seller.username,
          "ordini.table.monthOrder.component",
          `retrieveMonth() Call KO ${e.message}`
        );
        console.log(
          `ERROR, ${seller.username}, ordini.table.monthOrder.component, retrieveMonth() Call KO ${e.message}`
        );
      }
    }
  };

  const handleChangeyearMonth = (date) => {
    setEmpty(false);
    setLoading(true);
    getData(date.target.value);
    setFileName("report_mensile_" + date.target.value);
    setClick(true);
  };

  const getData = async (str) => {
    try {
      const res = await API.get(`/gestione-ordine/monthyearReport/${str}`, {
        headers: authHeader(),
      });
      if (res.data.length !== 0) {
        setOrdine(res.data);
        setLoading(false);
        //setEmpty(false);
        console.log(
          `INFO, ${seller.username}, ordini.table.monthOrder.component, getData monthyearReport`
        );
        Logging.log(
          "INFO",
          seller.username,
          "ordini.table.monthOrder.component",
          "getData monthyearReport"
        );
      } else {
        //setEmpty(true);
        setMsg(
          `${seller.username}, non ci sono ordini per la data selezionata`
        );
        console.log(
          `INFO, ${seller.username}, ordini.table.monthOrder.component, getData month order empty`
        );
        Logging.log(
          "INFO",
          seller.username,
          "ordini.table.monthOrder.component",
          "getData monthyearReport empty"
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
          seller.username,
          "ordini.table.monthOrder.component",
          `getData errore ${e.message}`
        );
        console.log(
          `ERROR , ${seller.username}, ordini.table.monthOrder.component, getData errore ${e.message}`
        );
      } else if (e.response.status === 403) {
        setLoading(false);
        setSnackColor("red");
        setResult("No token provided. Fai logout/login!");
        setOpen(true);
        Logging.log(
          "ERROR",
          seller.username,
          "ordini.table.monthOrder.component",
          `getData errore ${e.message}`
        );
        console.log(
          `ERROR , ${seller.username}, ordini.table.monthOrder.component, getData errore ${e.message}`
        );
      } else {
        setLoading(false);
        setSnackColor("red");
        setResult(e.message);
        setOpen(true);
        Logging.log(
          "ERROR",
          seller.username,
          "ordini.table.monthOrder.component",
          `getData errore ${e.message}`
        );
        console.log(
          `ERROR , ${seller.username}, ordini.table.monthOrder.component, getData errore ${e.message}`
        );
      }
    }
  };

  const handleReportClick = () => {
    var test = new jsPDF();
    test.text(
      `Report ordini per il mese ${fileName.substring(
        15,
        19
      )} - ${fileName.substring(19, 21)}`,
      10,
      15
    );
    test.autoTable({ html: "#reportmonthsingle", startY: 25 });
    var strb64 = btoa(test.output());
    if (
      isChrome ||
      isFirefox ||
      isSafari ||
      isOpera ||
      isIE ||
      isEdge ||
      isYandex ||
      isChromium ||
      isMobileSafari
    ) {
      test.save(`${fileName}.pdf`);
      console.log(
        `INFO, ${seller.username}, ordini.table.monthOrder.component, handleReportClick download from browser`
      );
      Logging.log(
        "INFO",
        seller.username,
        "ordini.table.monthOrder.component",
        `handleReportClick download from browser`
      );
    } else {
      Plugins.Filesystem.writeFile({
        path: `${fileName}.pdf`,
        data: strb64,
        directory: FilesystemDirectory.Documents,
        recursive: true,
      });
      Toast.show({
        text: `Download ${fileName}.pdf in ${FilesystemDirectory.Documents}`,
        position: "center",
        duration: "long",
      });
      console.log(
        `INFO, ${seller.username}, ordini.table.monthOrder.component, handleReportClick download from mobile`
      );
      Logging.log(
        "INFO",
        seller.username,
        "ordini.table.monthOrder.component",
        `handleReportClick download from mobile`
      );
    }
  };

  const renderHeader = () => {
    let headerElement = [
      "prodotto",
      "peso prodotto",
      "pezzatura",
      "peso totale",
      "quantità",
    ];
    return headerElement.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  const renderBody = () => {
    return (
      ordine &&
      ordine.map(({ _id, desc, pesoProdotto, pezzatura, totale, qty }) => {
        return (
          <tr key={_id}>
            <td>{_id.desc}</td>
            <td>{_id.pesoProdotto}</td>
            <td>{_id.pezzatura}</td>
            <td>{totale}</td>
            <td>{qty}</td>
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

  if (empty) {
    return (
      <div id="root-content">
        <TextField
          style={{ backgroundColor: "#6d6c6c" }}
          InputLabelProps={{ shrink: true }}
          InputProps={{ readOnly: true }}
          variant="outlined"
          value="Mese del report"
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Mese report</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={yearMonth}
            onChange={handleChangeyearMonth}
          >
            {tests &&
              tests.map((myData) => (
                <MenuItem
                  value={myData.dataInserimento}
                  key={myData.dataInserimento}
                >
                  {myData.dataInserimento}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <br></br>
        <Typography variant="h5" gutterBottom={true} color="textPrimary">
          {msg}
        </Typography>
      </div>
    );
  } else if (!loading) {
    return (
      <div id="root-content">
        <TextField
          style={{ backgroundColor: "#6d6c6c" }}
          InputLabelProps={{ shrink: true }}
          InputProps={{ readOnly: true }}
          variant="outlined"
          value="Mese del report"
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Mese report</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={yearMonth}
            onChange={handleChangeyearMonth}
          >
            {tests &&
              tests.map((myData) => (
                <MenuItem
                  value={myData.dataInserimento}
                  key={myData.dataInserimento}
                >
                  {myData.dataInserimento}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button
          onClick={() => handleReportClick()}
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
          Download Report
        </Button>
        <br></br>
        {click && (
          <div id="contentdaysingle">
            <table id="reportmonthsingle">
              <thead>
                <tr>{renderHeader()}</tr>
              </thead>
              <tbody>{renderBody()}</tbody>
            </table>
          </div>
        )}
        <br></br>
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
    return (
      <div id="root-content">
        <TextField
          style={{ backgroundColor: "#6d6c6c" }}
          InputLabelProps={{ shrink: true }}
          InputProps={{ readOnly: true }}
          variant="outlined"
          value="Mese del report"
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Mese report</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={yearMonth}
            onChange={handleChangeyearMonth}
          >
            {tests &&
              tests.map((myData) => (
                <MenuItem
                  value={myData.dataInserimento}
                  key={myData.dataInserimento}
                >
                  {myData.dataInserimento}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <CircularIndeterminate />
      </div>
    );
  }
};

export { AdminMonthOrder };
