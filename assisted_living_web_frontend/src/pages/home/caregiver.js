import React, {Fragment, useEffect, useState} from 'react';
import Avatar from 'react-avatar';

import MaterialTable from 'material-table';
import axios from 'axios';
import APIResponseErrorMessage from '../../commons/errorhandling/api-response-error-message';
import withStyles from '@material-ui/core/styles/withStyles';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {HOST} from '../../commons/hosts';
import authHeader from '../../commons/auth-header';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import * as Papa from 'papaparse';

const styles = (theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
});

const wsUrl = `${HOST.backend_api}/ws`;

let client = null;

export const disconnect = () => {
    client && client.disconnect();
};

export default withStyles(styles)(({
                                       tableIcons,
                                       classes
                                   }) => {
    let columns = [
        {
            title: 'id',
            field: 'id',
            hidden: true
        },
        {
            title: 'Name',
            field: 'name'
        },
        {
            title: 'Avatar',
            render: rowData => <Avatar maxInitials={1}
                                       size={40}
                                       round={true}
                                       name={rowData === undefined ? ' ' : rowData.name}/>
        },
        {
            title: 'Username',
            field: 'username'
        },
        {
            title: 'Birth Date',
            field: 'birthDate'
        },
        {
            title: 'Gender',
            field: 'gender'
        },
        {
            title: 'Address',
            field: 'address'
        },
        {
            title: 'Medical Record',
            field: 'medicalRecord'
        }
    ];

    const [data, setData] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);
    const [notify, setNotify] = useState(false);
    const [message, setMessage] = useState('');
    const [activitiesForPatientId, setActivitiesForPatientId] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem('username');

        axios.get('/patient', {headers: authHeader()})
            .then(res => {
                res.data.forEach(data => {
                    data.gender = `${data.gender[0].toUpperCase()}${data.gender.substring(1).toLocaleLowerCase()}`;
                    delete data.userType;
                });
                if (res.data.length > 0 && res.data[0].caregiver) {
                    setData(res.data.filter(item => item.caregiver.username === username));
                }
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
            });
    }, []);

    //TODO replace input method
    const handleAnomalyCheckParsing = (event) => {
        const file = event.target.files[0];

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                let payload = {
                    'patient-id': activitiesForPatientId,
                    activities: results.data.filter(activity => activity['Activity name'] != null)
                };

                axios.post('/activities/check-anomaly', payload, {headers: authHeader()})
                    .then(res => {
                    })
                    .catch(error => {
                        setError(error.response.data);
                        setErrorStatus(error.response.status);
                    });
            }
        });

        const anomalyCheckInput = document.getElementById('anomalyCheckInput');
        anomalyCheckInput.value = '';
        alert.show('Anomaly check successful. Check the Anomalies page for more information.');
    };

    const handleAnomalyCheckUpload = (rowData) => {
        setActivitiesForPatientId(rowData.id);
        const anomalyCheckInput = document.getElementById('anomalyCheckInput');
        anomalyCheckInput.click();
    };

    return (
        <Fragment>
            <div className={classes.root}>
                <Collapse in={notify}>
                    <Alert
                        severity="warning"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setNotify(false);
                                }}>
                                <CloseIcon fontSize="inherit"/>
                            </IconButton>
                        }>
                        {message}
                    </Alert>
                </Collapse>
            </div>
            {
                errorStatus > 0 &&
                <div style={{
                    width: 550,
                    margin: 'auto'
                }}><APIResponseErrorMessage errorStatus={errorStatus}
                                            error={error}/></div>
            }
            <br/>
            <input type={'file'}
                   id={'anomalyCheckInput'}
                   hidden={'hidden'}
                   onChange={handleAnomalyCheckParsing}/>
            <MaterialTable
                title="Patient Manager"
                columns={columns}
                data={data}
                icons={tableIcons}
                actions={[
                    rowData => ({
                        icon: () => <ErrorOutlineIcon color={'primary'}/>,
                        tooltip: 'Classify Activities',
                        onClick: (event, rowData) => handleAnomalyCheckUpload(rowData),
                        // disabled: rowData.routine != true
                    })
                ]}
            />
        </Fragment>
    );
});