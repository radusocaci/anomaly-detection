import React, {Fragment, useEffect, useState} from 'react';

import MaterialTable from 'material-table';
import axios from 'axios';
import APIResponseErrorMessage from '../commons/errorhandling/api-response-error-message';
import authHeader from '../commons/auth-header';

export default ({tableIcons}) => {
    let columns = [
        {
            title: 'id',
            field: 'id',
            hidden: true
        },
        {
            title: 'Name',
            field: 'name',
            cellStyle: {
                textAlign: 'center'
            }
        },
        {
            title: 'Dosage',
            field: 'dosage',
            cellStyle: {
                textAlign: 'center'
            }
        },
        {
            title: 'Side Effects',
            field: 'sideEffects',
            cellStyle: {
                textAlign: 'center'
            }
        }
    ];

    const [data, setData] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/medication', {headers: authHeader()})
            .then(res => {
                setData(res.data);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
            });
    }, []);

    const handleRowUpdate = (newData, oldData, resolve) => {
        setError(null);
        setErrorStatus(0);
        axios.post('/medication', newData, {headers: authHeader()})
            .then(res => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                resolve();
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
                resolve();
            });
    };

    const handleRowAdd = (newData, resolve) => {
        setError(null);
        setErrorStatus(0);
        axios.post('/medication', newData, {headers: authHeader()})
            .then(res => {
                let dataToAdd = [...data];
                dataToAdd.push(res.data);
                setData(dataToAdd);
                resolve();
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
        axios.delete('/medication/' + oldData.id, {headers: authHeader()})
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


    return (
        <Fragment>
            {
                errorStatus > 0 &&
                <div style={{
                    width: 550,
                    margin: 'auto'
                }}><APIResponseErrorMessage errorStatus={errorStatus}
                                            error={error}/></div>
            }
            <br/>
            <MaterialTable
                title="Medication Manager"
                columns={columns}
                data={data}
                icons={tableIcons}
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
                options={{
                    headerStyle: {
                        textAlign: 'center'
                    }
                }}
            />
        </Fragment>
    );
}