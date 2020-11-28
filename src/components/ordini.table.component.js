import React, { useState, useEffect } from "react";
import API from '../services/api';
import '../asset/mytable.css'
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';

const seller = AuthService.getCurrentUser();

const Table = (props) => {
    const [ordini, setOrdini] = useState([])
    useEffect(() => {
        getData()
    },[props.trig])

    const getData = async () => {
        if(seller.roles[0] === "ROLE_ADMIN"){
            const response = await API.get(`/gestione-ordini/ordine/all`, { headers: authHeader() })
            setOrdini(response.data)
        } else {
        const response = await API.get(`/gestione-ordini/ordini/${seller.username}`, { headers: authHeader() })
        setOrdini(response.data)
        }
    }

    const removeData = (id) => {
        API.delete(`gestione-ordini/ordine/${id}`, { headers: authHeader() }).then(res => {
            const del = ordini.filter(ordine => id !== ordine.id)
            setOrdini(del)
        })
    }

    const renderHeader = () => {
        let headerElement = ['data inserimento', 'venditore', 'desc', 'qty', 'peso totale','note', 'operation']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return ordini && ordini.map(({ id, desc, qty, pesoTotale, dataInserimento, seller, note }) => {
            return (
                <tr key={id}>
                    <td>{dataInserimento}</td>
                    <td>{seller}</td>
                    <td>{desc}</td>
                    <td>{qty}</td>
                    <td>{pesoTotale}</td>
                    <td>{note}</td>
                    <td className='operation'>
                        <button className='button' onClick={() => removeData(id)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div>
            <table id='ordini'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </div>
    )
}


export { Table };