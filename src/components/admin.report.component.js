import "date-fns";
import React, { useState, useEffect } from "react";
import API from '../services/api';
import "../asset/App.css";
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { isChrome, isFirefox, isSafari, isOpera, isIE, isEdge, isYandex, isChromium, isMobileSafari } from 'react-device-detect';
import { CircularIndeterminate } from './Loader';
import Logging from "../services/log.service";

const { Toast } = Plugins;

const seller = AuthService.getCurrentUser();

const AdminReportTable = () => {
    const [ordine, setOrdine] = useState([])
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [snackColor, setSnackColor] = useState('teal');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        var totalone = 0;
        try {
            const res = await API.get(`/gestione-ordine/todayOrder`, { headers: authHeader() })
            if (res.status === 200) {
                if (seller.roles[0] === "ROLE_ADMIN") {
                    for (var key in res.data) {
                        var obj = res.data[key];
                        for (var prop in obj) {
                            if (prop === 'totale') {
                                totalone = totalone + obj.totale;
                            }
                        }
                    }
                    res.data.push({ _id: { desc: "TOTALE" }, totale: totalone })
                    setOrdine(res.data)
                    setLoading(false);
                    console.log(`INFO, ${seller.username}, admin.report.component, getData todayOrder`)
                    Logging.log("INFO", seller.username, "admin.report.component", `get today order report`)
                }
            }
        }
        catch (e) {
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
                console.log(`ERROR, ${seller.username}, admin.report.component, getData error ${e.message}`)
                Logging.log("ERROR", seller.username, "admin.report.component", `getData errore ${e.message}`)
            } else if (e.response.status === 403) {
                setLoading(false);
                setSnackColor('red');
                setResult("No token provided. Fai logout/login!")
                setOpen(true);
                console.log(`ERROR, ${seller.username}, admin.report.component, getData error ${e.message}`)
                Logging.log("ERROR", seller.username, "admin.report.component", `getData errore ${e.message}`)
            } else {
                setLoading(false);
                setSnackColor('red');
                setResult(e.message)
                setOpen(true);
                console.log(`ERROR, ${seller.username}, admin.report.component, getData error ${e.message}`)
                Logging.log("ERROR", seller.username, "admin.report.component", `getData errore ${e.message}`)
            }
        };
    }



    const handleReportClick = () => {
        let today = new Date().toISOString().slice(0, 10)
        var test = new jsPDF();
        test.text(`Report ordini per il giorno ${today}`, 10, 15);
        test.autoTable({ html: '#report', startY: 25 });
        var strb64 = btoa(test.output());
        if (isChrome || isFirefox || isSafari || isOpera || isIE || isEdge || isYandex || isChromium || isMobileSafari) {
            test.save(`report_${today}.pdf`);
            console.log(`INFO, ${seller.username}, admin.report.component, handleReportClick download from browser`)
            Logging.log("INFO", seller.username, "admin.report.component", `handleReportClick download from browser`)
        } else {
            Plugins.Filesystem.writeFile({
                path: `report_${today}.pdf`,
                data: strb64,
                directory: FilesystemDirectory.Documents,
                recursive: true
            })
            Toast.show({
                text: `Download report_${today}.pdf in ${FilesystemDirectory.Documents}`,
                position: 'center',
                duration: 'long'
            })
            console.log(`INFO, ${seller.username}, admin.report.component, handleReportClick download from mobile`)
            Logging.log("INFO", seller.username, "admin.report.component", `handleReportClick download from mobile`)
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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    if (!loading) {
        return (
            <div>
                <Button onClick={() => handleReportClick()} size="large" style={{ display: 'flex', backgroundColor: "#F35B04", alignItems: 'center', justifyContent: 'center', "marginTop": "10px" }} startIcon={<CloudUploadIcon />} variant="outlined">
                    Download Report
        </Button>
                <br></br>
                <div id='content'>
                    <table id='report'>
                        <thead>
                            <tr>{renderHeader()}</tr>
                        </thead>
                        <tbody>
                            {renderBody()}
                        </tbody>
                    </table>
                </div>
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
            <CircularIndeterminate />
        )
    }
}


export { AdminReportTable };