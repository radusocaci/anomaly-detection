import React, {Fragment, useEffect, useState} from 'react';
import Avatar from 'react-avatar';

import MaterialTable from 'material-table';
import axios from 'axios';
import APIResponseErrorMessage from '../commons/errorhandling/api-response-error-message';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import authHeader from '../commons/auth-header';

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
                    {genders.map((country) => (
                        <MenuItem key={country}
                                  value={country}>
                            {country}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Address',
            field: 'address'
        }
    ];

    const [data, setData] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/caregiver', {headers: authHeader()})
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
    }, []);

    const handleRowUpdate = (newData, oldData, resolve) => {
        newData.gender = {
            gender: newData.gender
        };
        setError(null);
        setErrorStatus(0);
        axios.post('/caregiver', newData, {headers: authHeader()})
            .then(res => {
                newData.gender = newData.gender.gender;
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
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
        axios.post('/caregiver', newData, {headers: authHeader()})
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
        axios.delete('/caregiver/' + oldData.id, {headers: authHeader()})
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
                title="Caregiver Manager"
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
            />
        </Fragment>
    );
}