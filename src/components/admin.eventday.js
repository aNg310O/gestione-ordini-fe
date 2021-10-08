import "date-fns";
import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../asset/App.css";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Plugins, FilesystemDirectory } from "@capacitor/core";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
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
import Typography from "@material-ui/core/Typography";
import { CircularIndeterminate } from "./Loader";
import TextField from "@material-ui/core/TextField";

const { Toast } = Plugins;
const seller = AuthService.getCurrentUser();

const AdminEventDay = () => {
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [open, setOpen] = useState(false);
  const [snackColor, setSnackColor] = useState("teal");
  const [click, setClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [msg, setMsg] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState(allData);
  const [filterOne, setFilterOne] = useState("");
  const [filterTwo, setFilterTwo] = useState("");

  useEffect(() => {
    getData();
  }, [empty, loading]);

  const getData = async () => {
    try {
      const res = await API.get(`/getlog`, { headers: authHeader() });
      if (res.data.length !== 0) {
        setLoading(false);
        setEmpty(false);
        setFileName("Report_Eventi");
        setClick(true);
        setAllData(res.data);
        setFilteredData(res.data);
        console.log(
          `INFO, ${seller.username}, admin.eventday, getData eventlog`
        );
      } else {
        setEmpty(true);
        setMsg(`${seller.username}, non ci sono eventi.`);
        console.log(
          `INFO, ${seller.username}, admin.eventday, getData eventlog empty`
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
        console.log(
          `ERROR, ${seller.username}, admin.eventday, getData error ${e.message}`
        );
        Logging.log(
          "ERROR",
          seller.username,
          "admin.eventday",
          `WEB - getLOG errore ${e.message}`
        );
      } else if (e.response.status === 403) {
        setLoading(false);
        setSnackColor("red");
        setResult("No token provided. Fai logout/login!");
        setOpen(true);
        console.log(
          `ERROR, ${seller.username}, admin.eventday, getData error ${e.message}`
        );
        Logging.log(
          "ERROR",
          seller.username,
          "admin.eventday",
          `WEB - getLOG errore ${e.message}`
        );
      } else {
        setLoading(false);
        setSnackColor("red");
        setResult(e.message);
        setOpen(true);
        console.log(
          `ERROR, ${seller.username}, admin.eventday, getData error ${e.message}`
        );
        Logging.log(
          "ERROR",
          seller.username,
          "admin.eventday",
          `WEB - getData errore ${e.message}`
        );
      }
    }
  };

  const handleSearch = (event) => {
    setFilteredData(allData);
    setFilterOne(event.target.value);
    setFilterTwo("");
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      return data.timestamp.search(value) !== -1;
    });
    setFilteredData(result);
  };

  const handleSearchUser = (event) => {
    setFilteredData(allData);
    setFilterTwo(event.target.value);
    setFilterOne("");
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      return data.username.search(value) !== -1;
    });
    setFilteredData(result);
  };

  const handleReportClick = () => {
    //window.scrollTo(0,0)
    setFilterOne("");
    setFilterTwo("");
    var test = new jsPDF();
    test.text(fileName, 10, 15);
    test.autoTable({ html: "#reportday", startY: 25 });
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
      setFilteredData(allData);
      console.log(
        `INFO, ${seller.username}, admin.eventday, handleReportClick download from browser`
      );
      Logging.log(
        "INFO",
        seller.username,
        "admin.eventday",
        `WEB - handleReportClick download from browser`
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
      setFilteredData(allData);
      console.log(
        `INFO, ${seller.username}, admin.eventday, handleReportClick download from mobile`
      );
      Logging.log(
        "INFO",
        seller.username,
        "admin.eventday",
        `WEB - handleReportClick download from mobile`
      );
    }
  };

  const renderHeader = () => {
    let headerElement = ["severity", "page", "username", "text", "timestamp"];
    return headerElement.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  const renderTab = () => {
    return (
      filteredData &&
      filteredData.map(({ _id, severity, page, username, text, timestamp }) => {
        return (
          <tr key={_id}>
            <td>{severity}</td>
            <td>{page}</td>
            <td>{username}</td>
            <td>{text}</td>
            <td>{timestamp}</td>
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
        <Typography variant="h5" gutterBottom={true} color="textPrimary">
          {msg}
        </Typography>
      </div>
    );
  } else if (!loading) {
    return (
      <div id="root-content">
        <Button
          onClick={() => handleReportClick()}
          size="large"
          style={{
            display: "flex",
            backgroundColor: "#ff3d00",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px",
          }}
          startIcon={<CloudUploadIcon />}
          variant="outlined"
        >
          Download Event Log
        </Button>
        <br></br>
        <TextField
          label="Filtra per data(YYYY-MM-DD)"
          fullWidth
          style={{ margin: "10px" }}
          margin="none"
          onChange={(e) => handleSearch(e)}
          value={filterOne}
          type="text"
          variant="outlined"
        ></TextField>
        <TextField
          label="Filtra per utente"
          fullWidth
          style={{ margin: "10px" }}
          margin="none"
          onChange={(e) => handleSearchUser(e)}
          value={filterTwo}
          type="text"
          variant="outlined"
        ></TextField>
        {click && (
          <div id="contentday">
            <table id="reportday">
              <thead>
                <tr>{renderHeader()}</tr>
              </thead>
              {renderTab()}
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
        <CircularIndeterminate />
      </div>
    );
  }
};
export { AdminEventDay };
