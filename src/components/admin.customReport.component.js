import "date-fns";
import React, { useState, useEffect } from "react";
import API from '../services/api';
import "../asset/App.css";
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField'
import { format } from 'date-fns';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {isChrome, isFirefox, isSafari, isOpera, isIE, isEdge, isYandex, isChromium, isMobileSafari} from 'react-device-detect';
import Logging from "../services/log.service";
import Typography from '@material-ui/core/Typography'
import { CircularIndeterminate } from './Loader';

const { Toast } = Plugins;
const seller = AuthService.getCurrentUser();

const AdminReportDay = () => {
    const [ordine, setOrdine] = useState([])
    const [selectedDate, setSelectedDate] = useState();
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [snackColor, setSnackColor] = useState('teal');
    const [click, setClick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(true);
    const [msg, setMsg] = useState("");

    useEffect(() => {},[empty, loading])

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const str = format(date,'yyyyMMdd')
        setEmpty(false);
        setLoading(true)
        getData(str);
        setFileName("report_" + str);
        setClick(true);
      };

      const getData = async (str) => {
        try {
        var totalone = 0;
            const res = await API.get(`/gestione-ordine/dateOrder/${str}`, { headers: authHeader() })
            if (res.data.length !== 0) {
                        for (var key in res.data) {
                            var obj=res.data[key];
                            for (var prop in obj) {
                                if (prop === 'totale') {
                                    totalone = totalone + obj.totale;
                                }
                            }
                          }
                          res.data.push({_id: {desc: "TOTALE"}, totale: totalone })
                          setOrdine(res.data)
                          setLoading(false)
                          setEmpty(false);
                          console.log(`INFO, ${seller.username}, admin.customReport.component, getData dateOrder`)
                          Logging.log("INFO", seller.username, "admin.customReport.component", `Eseguito report per la data ${str}`)
                    } else {
                    setEmpty(true);
                    setMsg(`${seller.username}, non ci sono ordini per la data selezionata`);
                    console.log(`INFO, ${seller.username}, admin.customReport.component, getData not today order yet`)
                    Logging.log("INFO", seller.username, "admin.customReport.component", `Eseguito report per la data ${str}, nessun risultato trovato`)
                    }
            }
        catch(e) {
            if (e.message === "Network Error") {
                setLoading(false);
                setSnackColor('red');
                setResult("Non sei connesso ad internet...")
                setOpen(true);
            } else if (e.response.status === 401) {
                setLoading(false);
                      setSnackColor('red');
                      setResult("Sessione scaduta. Fai logout/login!")
                      setOpen(true);
                      console.log(`ERROR, ${seller.username}, admin.customReport.component, getData error ${e.message}`)
                      Logging.log("ERROR", seller.username, "admin.customReport.component", `getData errore ${e.message}`)
                    } else if (e.response.status === 403) {
                        setLoading(false);
                      setSnackColor('red');
                      setResult("No token provided. Fai logout/login!")
                      setOpen(true);
                      console.log(`ERROR, ${seller.username}, admin.customReport.component, getData error ${e.message}`)
                      Logging.log("ERROR", seller.username, "admin.customReport.component", `getData errore ${e.message}`)
                    } else {
                        setLoading(false);
                      setSnackColor('red');
                      setResult(e.message)
                      setOpen(true);
                      console.log(`ERROR, ${seller.username}, admin.customReport.component, getData error ${e.message}`)
                      Logging.log("ERROR", seller.username, "admin.customReport.component", `getData errore ${e.message}`)
                    }
                  };
              }


    const handleReportClick = () => {
        //window.scrollTo(0,0)
        var test = new jsPDF();
        test.text(`Report ordini per il giorno ${fileName.substring(7,16)}`, 10, 15);
        test.autoTable({html: '#reportday', startY: 25 });
        var strb64 = btoa(test.output());
        if(isChrome || isFirefox || isSafari || isOpera || isIE || isEdge || isYandex || isChromium || isMobileSafari){
            test.save(`${fileName}.pdf`);
            console.log(`INFO, ${seller.username}, admin.customReport.component, handleReportClick download from browser`)
            Logging.log("INFO", seller.username, "admin.customReport.component", `handleReportClick download from browser`) 
        } else {
            Plugins.Filesystem.writeFile({
                path: `${fileName}.pdf`,
                data: strb64,
                directory: FilesystemDirectory.Documents,
                recursive:true
            })
            Toast.show({
                text: `Download ${fileName}.pdf in ${FilesystemDirectory.Documents}`,
                position: 'center',
                duration: 'long'
            })
            console.log(`INFO, ${seller.username}, admin.customReport.component, handleReportClick download from mobile`)
            Logging.log("INFO", seller.username, "admin.customReport.component", `handleReportClick download from mobile`) 
        }
        };


    const renderHeader = () => {
        let headerElement = ['prodotto', 'peso prodotto', 'pezzatura', 'quantità', 'peso totale (gr)', 'data inserimento']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return ordine && ordine.map(({ _id, qty, totale, dataInserimento }) => {
            return (
                <tr key={_id.desc}>
                    <td>{_id.desc}</td>
                    <td>{_id.pesoProdotto}</td>
                    <td>{_id.pezzatura}</td>
                    <td>{qty}</td>
                    <td>{totale}</td>
                    <td>{dataInserimento}</td>
                </tr>
            )
        })
    }

    const handleKeypress = (e) => {
        e.preventDefault();
        return false
        }

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
              return;
            }
            setOpen(false);
          };

    if (empty) {
            return (
                <div id='root-content'>
                <TextField style={{ backgroundColor: "#6d6c6c"}} InputLabelProps={{ shrink: true, }} InputProps={{ readOnly: true, }} variant="outlined" value="Scegli la data"/>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        InputProps={{ readOnly: true, }}
                        format="yyyyMMdd"
                        disableFuture={true}
                        id="date-picker-inline-custom"
                        inputVariant="filled"
                        onKeyPress={(e) => { handleKeypress(e)}}
                        variant="dialog"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
            </MuiPickersUtilsProvider>
            <Typography variant="h5" gutterBottom={true} color='textPrimary'>{msg}</Typography>
            </div>
            ) 
            } else if (!loading) {
    return (
        <div id='root-content'>
        <TextField style={{ backgroundColor: "#6d6c6c"}} InputLabelProps={{ shrink: true, }} InputProps={{ readOnly: true, }} variant="outlined" value="Scegli la data"/>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                InputProps={{ readOnly: true, }}
                format="yyyyMMdd"
                disableFuture={true}
                id="date-picker-inline-custom"
                inputVariant="filled"
                onKeyPress={(e) => { handleKeypress(e)}}
                variant="dialog"
                value={selectedDate}
                onChange={handleDateChange}
            />
    </MuiPickersUtilsProvider>

        <Button onClick={() => handleReportClick()} size="large" style={{ display: 'flex', backgroundColor: "#ff3d00", alignItems: 'center', justifyContent: 'center', "marginTop": "10px" }} startIcon={<CloudUploadIcon />} variant="outlined">
            Download Report
        </Button>
        <br></br>
        { click && (<div id='contentday'>
            <table id='reportday'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </div>)}
        <br></br>
        <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent style={{
          backgroundColor: snackColor,
        }}
          message={result}
        />
      </Snackbar>
        </div>
    )
 } else {
    return (
        <div id='root-content'>
        <TextField style={{ backgroundColor: "#6d6c6c"}} InputLabelProps={{ shrink: true, }} InputProps={{ readOnly: true, }} variant="outlined" value="Scegli la data"/>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                InputProps={{ readOnly: true, }}
                format="yyyyMMdd"
                disableFuture={true}
                id="date-picker-inline-custom"
                inputVariant="filled"
                onKeyPress={(e) => { handleKeypress(e)}}
                variant="dialog"
                value={selectedDate}
                onChange={handleDateChange}
            />
    </MuiPickersUtilsProvider>
    <CircularIndeterminate />
    </div>
    )}
    }
export { AdminReportDay };