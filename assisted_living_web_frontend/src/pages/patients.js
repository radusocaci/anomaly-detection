import React, {Fragment, useEffect, useState} from 'react';
import Avatar from 'react-avatar';

import MaterialTable from 'material-table';
import axios from 'axios';
import APIResponseErrorMessage from '../commons/errorhandling/api-response-error-message';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import authHeader from '../commons/auth-header';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ReplayIcon from '@material-ui/icons/Replay';
import * as Papa from 'papaparse';
import {useAlert} from 'react-alert';
import {useHistory} from 'react-router-dom';

export default ({
                    genders,
                    tableIcons
                }) => {
    let columns = [
        {
            title: 'id',
            field: 'id',
            hidden: true
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
            title: 'Password',
            field: 'password',
            render: rowData => <p style={{marginTop: '25px'}}>{rowData.password.split('').map(() => '*')}</p>
        },
        {
            title: 'Name',
            field: 'name'
        },
        {
            title: 'Birth Date',
            field: 'birthDate'
        },
        {
            title: 'Gender',
            field: 'gender',
            editComponent: ({
                                value,
                                onRowDataChange,
                                rowData
                            }) => (
                <Select
                    value={value}
                    onChange={(event) => {
                        onRowDataChange({
                            ...rowData,
                            gender: (event.target.value)
                        });
                    }}>
                    {genders.map((gender) => (
                        <MenuItem key={gender}
                                  value={gender}>
                            {gender}
                        </MenuItem>
                    ))}
                </Select>
            )
        },
        {
            title: 'Address',
            field: 'address'
        },
        {
            title: 'Medical Record',
            field: 'medicalRecord'
        },
        {
            title: 'Caregiver',
            field: 'caregiver.name',
            editComponent: ({
                                value,
                                onRowDataChange,
                                rowData
                            }) => (
                <Select
                    value={value}
                    onChange={(event) => {
                        onRowDataChange({
                            ...rowData,
                            'caregiver-id': (caregivers.find(caregiver => caregiver.name === event.target.value).id)
                        });
                    }}>
                    {caregivers.map((caregiver) => (
                        <MenuItem key={caregiver.id}
                                  value={caregiver.name}>
                            {caregiver.name}
                        </MenuItem>
                    ))}
                </Select>
            )
        }
    ];

    const alert = useAlert();
    const history = useHistory();

    const [data, setData] = useState([]);
    const [caregivers, setCaregivers] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);
    const [activitiesForPatientId, setActivitiesForPatientId] = useState(null);

    useEffect(() => {
        axios.get('/patient', {headers: authHeader()})
            .then(res => {
                res.data.forEach(data => {
                    data.gender = `${data.gender[0].toUpperCase()}${data.gender.substring(1).toLocaleLowerCase()}`;
                    delete data.userType;
                });
                setData(res.data);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
            });
        axios.get('/caregiver', {headers: authHeader()})
            .then(res => {
                setCaregivers(res.data);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
            });
    }, []);

    const handleRowUpdate = (newData, oldData, resolve) => {
        newData.gender = {
            gender: newData.gender
        };
        setError(null);
        setErrorStatus(0);
        axios.post('/patient', newData, {headers: authHeader()})
            .then(res => {
                const dataUpdate = [...data];
                let serverData = res.data;
                serverData.gender = newData.gender.gender;
                const index = oldData.tableData.id;
                dataUpdate[index] = serverData;
                setData([...dataUpdate]);
                resolve();
                setErrorStatus(0);
                setError(null);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
                resolve();
            });
    };

    const handleRowAdd = (newData, resolve) => {
        newData.gender = {
            gender: newData.gender
        };
        setError(null);
        setErrorStatus(0);
        axios.post('/patient', newData, {headers: authHeader()})
            .then(res => {
                let dataToAdd = [...data];
                let serverData = res.data;
                serverData.gender = newData.gender.gender;
                delete serverData.userType;
                dataToAdd.push(serverData);
                setData(dataToAdd);
                resolve();
                setErrorStatus(0);
                setError(null);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
                resolve();
            });
    };

    const handleRowDelete = (oldData, resolve) => {
        setError(null);
        setErrorStatus(0);
        axios.delete('/patient/' + oldData.id, {headers: authHeader()})
            .then(res => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
                resolve();
            });
    };

    const handleRoutineParsing = (event) => {
        const file = event.target.files[0];

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                let payload = {
                    'patient-id': activitiesForPatientId,
                    activities: results.data.filter(activity => activity['Activity name'] != null)
                };

                axios.post('/activities', payload, {headers: authHeader()})
                    .then(res => {
                    })
                    .catch(error => {
                        setError(error.response.data);
                        setErrorStatus(error.response.status);
                    });
            }
        });

        const routineInput = document.getElementById('routineInput');
        routineInput.value = '';
        alert.show('The routine has been extracted! You can now check for anomalies.');
    };

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
        alert.show('Activities have been successfully classified. Do you want to check out the results now?', {
            title: 'Activity-based classification successful',
            actions: [
                {
                    copy: 'Yes',
                    onClick: () => history.push('/anomalies')
                }
            ],
            closeCopy: 'No',
        });
    };

    const handleRoutineUpload = (rowData) => {
        setActivitiesForPatientId(rowData.id);
        const routineInput = document.getElementById('routineInput');
        routineInput.click();
    };

    const handleAnomalyCheckUpload = (rowData) => {
        setActivitiesForPatientId(rowData.id);
        const anomalyCheckInput = document.getElementById('anomalyCheckInput');
        anomalyCheckInput.click();
    };

    const handleRoutineDelete = (rowData) => {
        axios.delete('/activities/' + rowData.id, {headers: authHeader()})
            .then(res => {
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
            });
    };


    return (
        <Fragment>
            {
                errorStatus > 0 &&
                <div style={{
                    width: '55%',
                    margin: 'auto'
                }}><APIResponseErrorMessage errorStatus={errorStatus}
                                            error={error}/></div>
            }
            <br/>
            <input type={'file'}
                   id={'routineInput'}
                   hidden={'hidden'}
                   onChange={handleRoutineParsing}/>
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
                    {
                        icon: () => <AddCircleOutlineIcon color={'primary'}/>,
                        tooltip: 'Extract Routine',
                        onClick: (event, rowData) => handleRoutineUpload(rowData)
                    },
                    rowData => ({
                        icon: () => <ReplayIcon color={'primary'}/>,
                        tooltip: 'Remove Activities',
                        onClick: (event, rowData) => alert.show('Are you sure you want to delete all activities registered for this patient?', {
                            title: 'Delete all activities for this patient',
                            actions: [
                                {
                                    copy: 'Yes',
                                    onClick: () => handleRoutineDelete(rowData)
                                }
                            ],
                            closeCopy: 'No',
                        }),
                        // disabled: rowData.routine != true
                    }),
                    rowData => ({
                        icon: () => <ErrorOutlineIcon color={'primary'}/>,
                        tooltip: 'Classify Activities',
                        onClick: (event, rowData) => handleAnomalyCheckUpload(rowData),
                        // disabled: rowData.routine != true
                    })
                ]}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            handleRowUpdate(newData, oldData, resolve);
                        }),
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            handleRowAdd(newData, resolve);
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            handleRowDelete(oldData, resolve);
                        }),
                }}
            />
        </Fragment>
    );
}