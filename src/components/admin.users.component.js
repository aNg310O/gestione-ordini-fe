import React, { useState, useEffect } from "react";
import API from '../services/api';
import '../asset/mytable.css'
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { CircularIndeterminate } from './Loader'


const seller = AuthService.getCurrentUser();

const AdminUsersTable = (props) => {
    const [users, setUsers] = useState([])
    const [snackColor, setSnackColor] = useState('teal');
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    const [loading,setLoading] = useState(true);
    
    useEffect(() => {
        getData()
    },[props.trigU])


    const getData = () => {
        API.get(`/api/user/findUser`, { headers: authHeader() })
            .then(res => {
                if (res.status === 200) {
                    if(seller.roles[0] === "ROLE_ADMIN") {
                    setUsers(res.data)
                    setLoading(false);
                    }
                }})
                .catch(e => {
                    if (e.response.status === 401) {
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
                  });
              }

    
    const removeData = (username) => {
        if (username === seller.username) {
            setResult("Non puoi rimuovere te stesso...")
            setSnackColor('orange');
            setOpen(true);
        } else {
            var answer = window.confirm(`Vuoi davvero eliminare l'utente?`);
            if (answer) {
                API.delete(`api/user/deleteUser/${username}`, { headers: authHeader() }).then(res => {
                const del = users.filter(users => username !== users.username)
                setUsers(del)
        })}
    }}

    const renderHeader = () => {
        let headerElement = ['username', 'email', '']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return users && users.map(({ id, username, email}) => {
            return (
                <tr key={id}>
                    <td>{username}</td>
                    <td>{email}</td>
                    <td className='operation'>
                        <button className='button' onClick={() => removeData(username)}>Elimina</button>
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


export { AdminUsersTable };