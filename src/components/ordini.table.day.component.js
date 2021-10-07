import React, { useState, useEffect } from "react";
import API from '../services/api';
import "../asset/App.css";
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { CircularIndeterminate } from './Loader';
import Typography from '@material-ui/core/Typography'
import Logging from "../services/log.service";
import qs from 'qs';

const seller = AuthService.getCurrentUser();

const TableDay = (props) => {
    const [ordini, setOrdini] = useState([])
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [snackColor, setSnackColor] = useState('teal');
    const [loading, setLoading] = useState(true);
    const [empty, setEmpty] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => { getData() }, [props.str])

    const getData = async () => {
        try {
                const response = await API.get(`/gestione-ordini/ordiniDay`, {
                    headers: authHeader(),
                    params: {
                      seller: seller.username,
                      orderDate : props.str
                    },
                    paramsSerializer: (params) => {
                      return qs.stringify(params, { arrayFormat: 'repeat' })
                    },
                  })
                if (response.data.length !== 0){
                setOrdini(response.data)
                setLoading(false);
                setEmpty(false);
                console.log(`INFO, ${seller.username}, ordini.table.component, getData user ordini`)
                Logging.log("INFO", seller.username, "ordini.table.component", `getData day user order`)
                } else {
                    setEmpty(true);
                    setMsg(`${seller.username}, non ci sono ordini per la data selezionata`);
                    console.log(`INFO, ${seller.username}, ordini.table.component, getData not today order yet`)
                    Logging.log("INFO", seller.username, "ordini.table.component", `getData day user order is empty`)
                }
            
        } catch (e) {
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
                Logging.log("ERROR", seller.username, "ordini.table.component", `getData errore ${e.message}`)
                console.log(`ERROR , ${seller.username}, ordini.table.component, getData errore ${e.message}`)
              } else if (e.response.status === 403) {
                setLoading(false);
                setSnackColor('red');
                setResult("No token provided. Fai logout/login!")
                setOpen(true);
                Logging.log("ERROR", seller.username, "ordini.table.component", `getData errore ${e.message}`)
                console.log(`ERROR , ${seller.username}, ordini.table.component, getData errore ${e.message}`)
              } else {
                setLoading(false);
                setSnackColor('red');
                setResult(e.message)
                setOpen(true);
                Logging.log("ERROR", seller.username, "ordini.table.component", `getData errore ${e.message}`)
                console.log(`ERROR , ${seller.username}, ordini.table.component, getData errore ${e.message}`)
        }
    }
}

    const renderHeader = () => {
        let headerElement = ['prodotto', 'peso prodotto', 'pezzatura', 'quantità', 'peso totale (gr)', 'note', 'venditore', 'data inserimento']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return ordini && ordini.map(({ id, desc, pesoProdotto, grammatura, qty, pesoTotale, note, seller, dataInserimento }) => {
            return (
                <tr key={id}>
                    <td>{desc}</td>
                    <td>{pesoProdotto}</td>
                    <td>{grammatura}</td>
                    <td>{qty}</td>
                    <td>{pesoTotale}</td>
                    <td>{note}</td>
                    <td>{seller}</td>
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

      if (empty) {
          return <Typography variant="h5" gutterBottom={true} color='textPrimary'>{msg}</Typography> ;
      } else if (!loading){
    return (
        <div>
            <table id='ordini' style={{ "marginBottom": "2em" }} >
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>

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

export { TableDay };