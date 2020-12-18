import React, { useState, useEffect } from "react";
import API from '../services/api';
import '../asset/mytable.css'
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { CircularIndeterminate } from './Loader';
import Typography from '@material-ui/core/Typography'

const seller = AuthService.getCurrentUser();

const Table = () => {
    const [ordini, setOrdini] = useState([])
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [snackColor, setSnackColor] = useState('teal');
    const [ loading, setLoading ] = useState(true);
    const [empty, setEmpty] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            if (seller.roles[0] === "ROLE_ADMIN") {
                const response = await API.get(`/gestione-ordini/ordine/all`, { headers: authHeader() })
                console.log(response.data.length)
                if (response.data.length !== 0){
                setOrdini(response.data)
                setLoading(false);
                } else {
                    setEmpty(true);
                    setMsg(`${seller.username}, ancora non ci sono ordini per oggi`);
                }
            } else {
                const response = await API.get(`/gestione-ordini/ordini/${seller.username}`, { headers: authHeader() })
                if (response.data.length !== 0){
                setOrdini(response.data)
                setLoading(false);
                } else {
                    setEmpty(true);
                    setMsg(`${seller.username}, ancora non ci sono ordini per oggi`);
                }
            }
        } catch (e) {
            if (e.message === "Network Error") {
                setLoading(false);
                setSnackColor('red');
                setResult("Non sei connesso ad internet...")
                setOpen(true);
            } else if (e.response.status === 401) {
                setSnackColor('red');
                setResult("Sessione scaduta. Fai logout/login!")
                setOpen(true);
              } else if (e.response.status === 403) {
                setSnackColor('red');
                setResult("No token provided. Fai logout/login!")
                setOpen(true);
              } else {
                setSnackColor('red');
                setResult(e.message)
                setOpen(true);
        }
    }
}

    const removeData = (id) => {
        var answer = window.confirm(`Vuoi davvero eliminare questo ordine?`);
        if (answer) {
            API.delete(`gestione-ordini/ordine/${id}`, { headers: authHeader() }).then(res => {
                const del = ordini.filter(ordine => id !== ordine.id)
                setOrdini(del)
            })
        }
    }

    const renderHeader = () => {
        let headerElement = ['desc', 'qty', 'peso totale', 'note', 'venditore', '']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return ordini && ordini.map(({ id, desc, qty, pesoTotale, note, seller }) => {
            return (
                <tr key={id}>
                    <td>{desc}</td>
                    <td>{qty}</td>
                    <td>{pesoTotale}</td>
                    <td>{note}</td>
                    <td>{seller}</td>
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

      if (empty) {
          return <Typography variant="h5" gutterBottom={true} color='textPrimary'>{msg}</Typography> ;
      } else if (!loading){
    return (
        <div>
            <table id='ordini' style={{ "margin-bottom": "2em" }} >
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


export { Table };