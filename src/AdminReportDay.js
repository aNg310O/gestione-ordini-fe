import "date-fns";
import React, { useState, useEffect } from "react";
import API from './api';
import './mytable.css'
import './other2_table.css'
import AuthService from "./services/auth.service";
import authHeader from './services/auth-header';
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
import * as html2canvas from 'html2canvas';
import 'jspdf-autotable';

const seller = AuthService.getCurrentUser();

const AdminReportDay = (props) => {
    const [ordine, setOrdine] = useState([])
    const [selectedDate, setSelectedDate] = useState();
    const [fileName, setFileName] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {},[props.trigRD])

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const str = format(date,'yyyyMMdd')
        getData(str);
        setFileName("report_" + str);
      };

    const getData = async (str) => {
        var totalone=0;
        if(seller.roles[0] === "ROLE_ADMIN"){
            const response = await API.get(`/gestione-ordine/dateOrder/${str}`, { headers: authHeader() })
            for (var key in response.data) {
                var obj=response.data[key];
                for (var prop in obj) {
                    if (prop === 'totale') {
                        totalone = totalone + obj.totale;
                    }
                }
              }
              response.data.push({_id: "TOTALE", qty: 0, totale: totalone })
              setOrdine(response.data)
              setPage(Object.keys(response.data).length);
        } 
    }

    const handleReportClick = () => {
        var myFormat;
        if ( page > 19 ) {
            myFormat = ['210', '594'];
        } else {
            myFormat = ['210', '297'];
        }
        console.log(myFormat)
        window.scrollTo(0,0)
        const input = document.getElementById('content',{scrollY: -window.scrollY});
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: myFormat,
                });
                pdf.text(`Report ordini per il giorno ${fileName}`, 5, 10);
                pdf.addImage(imgData, 'JPEG', 6, 25);
                pdf.save(`${fileName}.pdf`);
            }); 
        };

    const renderHeader = () => {
        let headerElement = ['desc', 'quantità', 'peso totale (gr)', 'data inserimento']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return ordine && ordine.map(({ _id, qty, totale, dataInserimento }) => {
            return (
                <tr key={_id}>
                    <td>{_id}</td>
                    <td>{qty}</td>
                    <td>{totale}</td>
                    <td>{dataInserimento}</td>
                </tr>
            )
        })
    }

    return (
        <div id='root-content'>
        <TextField InputLabelProps={{ shrink: true, }} InputProps={{ readOnly: true, }} variant="outlined" value="Inserire la data per il report"/>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                format="yyyyMMdd"
                disableFuture={true}
                id="date-picker-inline"
                inputVariant="filled"
                variant="dialog"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
        <Button onClick={() => handleReportClick()} size="large" style={{ display: 'flex', backgroundColor: "#3f51b5", alignItems: 'center', justifyContent: 'center' }} startIcon={<CloudUploadIcon />} variant="outlined">
            Download Report
        </Button>
        <div id="content">
            <table id="report">
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </div>
        </div>
    )
}


export { AdminReportDay };