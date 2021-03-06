import React, { useState, useEffect } from "react";
import API from '../services/api';
import "../asset/App.css";
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { CircularIndeterminate } from './Loader';
import Logging from "../services/log.service";

const seller = AuthService.getCurrentUser();

const ProductTable = () => {
    const [prodotto, setProdotto] = useState([])
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [snackColor, setSnackColor] = useState('teal');
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        getData()
    }, []);

    const getData = () => {
        API.get(`/gestione-ordini/prodotti/`, { headers: authHeader() })
            .then(res => {
                if (res.status === 200) {
                    if(seller.roles[0] === "ROLE_ADMIN") {
                    setProdotto(res.data)
                    setLoading(false);
                    console.log(`INFO, ${seller.username}, admin.product.component, getData get dei prodotti`)
                    }
                }})
                .catch(e => {
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
                      Logging.log("ERROR", seller.username, "admin.product.component", `getData errore ${e.message}`)
                      console.log(`ERROR, ${seller.username}, admin.product.component, getData errore ${e.message}`)
                    } else if (e.response.status === 403) {
                      setLoading(false);
                      setSnackColor('red');
                      setResult("No token provided. Fai logout/login!")
                      setOpen(true);
                      Logging.log("ERROR", seller.username, "admin.product.component", `getData errore ${e.message}`)
                      console.log(`ERROR, ${seller.username}, admin.product.component, getData errore ${e.message}`)
                    } else {
                      setLoading(false);
                      setSnackColor('red');
                      setResult(e.message)
                      setOpen(true);
                      Logging.log("ERROR", seller.username, "admin.product.component", `getData errore ${e.message}`)
                      console.log(`ERROR, ${seller.username}, admin.product.component, getData errore ${e.message}`)
                    }
                  });
              }

    const removeData = (id) => {
        var answer = window.confirm(`Vuoi davvero eliminare il prodotto?`);
        if (answer) {
            API.delete(`gestione-ordini/prodotto/${id}`, { headers: authHeader() }).then(res => {
                const del = prodotto.filter(prodotto => id !== prodotto.id)
                setProdotto(del)
                console.log(`INFO, ${seller.username}, admin.product.component, removeData prodotto ${id}`)
            })
        }
    }

    const renderHeader = () => {
        let headerElement = ['desc', 'gr al pezzo', 'peso totale', '']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return prodotto && prodotto.map(({ id, desc, grammatura, pesoTotale }) => {
            return (
                <tr key={id}>
                    <td>{desc}</td>
                    <td>{grammatura}</td>
                    <td>{pesoTotale}</td>
                    <td className='operation'>
                        <button className='button' onClick={() => removeData(id)}>Elimina</button>
                    </td>
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
            <table id='styled-table'>
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


export { ProductTable };