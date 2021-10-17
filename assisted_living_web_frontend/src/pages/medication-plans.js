import React, {Fragment, useEffect, useState} from 'react';

import MaterialTable from 'material-table';
import axios from 'axios';
import APIResponseErrorMessage from '../commons/errorhandling/api-response-error-message';
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import styles from '../commons/styles/project-style.css';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import authHeader from '../commons/auth-header';

const styless = (theme) => ({
    ...theme.others
});


export default withStyles(styless)(({tableIcons, classes}) => {
    let columns = [
        {
            title: 'id',
            field: 'id',
            hidden: true
        },
        {
            title: 'Start Date',
            field: 'treatmentStartDate',
            cellStyle: {
                textAlign: 'center'
            }
        },
        {
            title: 'End Date',
            field: 'treatmentEndDate',
            cellStyle: {
                textAlign: 'center'
            }
        },
        {
            title: 'Intake Interval',
            field: 'intakeInterval',
            cellStyle: {
                textAlign: 'center'
            }
        },
        {
            title: 'Patient',
            field: 'patient.name',
            cellStyle: {
                textAlign: 'center'
            }
        }
    ];

    const [data, setData] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medications, setMedications] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [medicalPlan, setMedicalPlan] = useState(null);
    const [medicalPlanToAdd, setMedicalPlanToAdd] = useState(null);
    const [error, setError] = useState(null);
    const [collapseForm, setCollapseForm] = useState(false);
    const [collapseForm2, setCollapseForm2] = useState(false);
    const [selectedMedications, setSelectedMedications] = useState([]);

    useEffect(() => {
        axios.get('/medical-plan', {headers: authHeader()})
            .then(res => {
                setData(res.data);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
            });
        axios.get('/patient', {headers: authHeader()})
            .then(res => {
                setPatients(res.data);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
            });
        axios.get('/medication', {headers: authHeader()})
            .then(res => {
                setMedications(res.data);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
            });
    }, []);

    const handleRowAdd = (newData, resolve) => {
        setCollapseForm2(!collapseForm2);
        setMedicalPlanToAdd({
            'treatment-start-date': '',
            'treatment-end-date': '',
        });
    };

    const createMedicationPlan = () => {
        setError(null);
        setErrorStatus(0);
        setSelectedMedications([]);
        handleClose();
        axios.post('/medical-plan', medicalPlanToAdd, {headers: authHeader()})
            .then(res => {
                let dataToAdd = [...data];
                dataToAdd.push(res.data);
                setData(dataToAdd);
                setErrorStatus(0);
                setError(null);
                setMedicalPlanToAdd(null);
            })
            .catch(error => {
                setError(error.response.data);
                setErrorStatus(error.response.status);
                setMedicalPlanToAdd(null);
            });
    };

    const handleRowDelete = (oldData, resolve) => {
        setError(null);
        setErrorStatus(0);
        axios.delete('/medical-plan/' + oldData.id, {headers: authHeader()})
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

    const handleRowClick = (selectedRow) => {
        setMedicalPlan(data.find(data => data.id === selectedRow.id));
        setCollapseForm(!collapseForm);
    };

    const handleClose = () => {
        setCollapseForm2(!collapseForm2);
        setSelectedMedications([]);
    };

    const handleChange = (event) => {
        const toAdd = {...medicalPlanToAdd};
        toAdd[event.target.name] = event.target.value;
        setMedicalPlanToAdd(toAdd);
    };

    const handleChangeMultiple = (event) => {
        setSelectedMedications(event.target.value);
        const medicationIds = [];
        event.target.value.forEach(selectedMedication => {
            medicationIds.push(medications.find(medication => medication.name === selectedMedication).id);
        });
        const toAdd = {...medicalPlanToAdd};
        toAdd[event.target.name] = medicationIds;
        setMedicalPlanToAdd(toAdd);
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
                title="Medication Plan Manager"
                columns={columns}
                data={data}
                icons={tableIcons}
                editable={{
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            handleRowDelete(oldData, resolve);
                        })
                }}
                actions={[
                    {
                        icon: tableIcons.Add,
                        tooltip: 'Add medication plan',
                        isFreeAction: true,
                        onClick: handleRowAdd
                    }
                ]}
                onRowClick={(evt, selectedRow) => handleRowClick(selectedRow)}
                options={{
                    headerStyle: {
                        textAlign: 'center'
                    }
                }}
            />
            {collapseForm && <Modal isOpen={collapseForm}
                                    toggle={() => setCollapseForm(!collapseForm)}>
                <ModalHeader toggle={() => setCollapseForm(!collapseForm)}
                             className={styles.modalTitle}> Medication plan details
                    for {medicalPlan.patient.name} </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs="3"> From: </Col> <Col xs="auto"
                                                       className={styles.modalText}>{medicalPlan.treatmentStartDate} </Col>
                    </Row>
                    <Row>
                        <Col xs="3"> To: </Col> <Col xs="auto"
                                                      className={styles.modalText}>{medicalPlan.treatmentEndDate} </Col>
                    </Row>
                    <Row>
                        <Col xs="3"> Intake: </Col> <Col xs="auto"
                                                      className={styles.modalText}>{medicalPlan.intakeInterval} </Col>
                    </Row>
                    <Row>
                        <Col xs="3"> Medications : </Col> <Col xs="auto"
                                                               className={styles.modalText}>
                        <ul>
                            {medicalPlan.medications.map(item => (
                                <li key={item.id}>{item.name} - {item.dosage}</li>
                            ))}
                        </ul>
                    </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger"
                            onClick={() => setCollapseForm(!collapseForm)}>Cancel</Button>
                </ModalFooter>
            </Modal>}

            {collapseForm2 && <Modal isOpen={collapseForm2}>
                <ModalHeader toggle={handleClose}
                             className={styles.modalTitle}> Create medication plan
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <TextField id={'treatmentStartDate'}
                                   name={'treatment-start-date'}
                                   type={'treatmentStartDate'}
                                   label={'treatmentStartDate'}
                                   className={classes.textField}
                                   value={medicalPlanToAdd.treatmentStartDate}
                                   onChange={handleChange}/>
                    </Row>
                    <Row>
                        <TextField id={'treatmentEndDate'}
                                   name={'treatment-end-date'}
                                   type={'treatmentEndDate'}
                                   label={'treatmentEndDate'}
                                   className={classes.textField}
                                   value={medicalPlanToAdd.treatmentEndDate}
                                   onChange={handleChange}/>
                    </Row>
                    <Row>
                        <TextField id={'intakeInterval'}
                                   name={'intakeInterval'}
                                   type={'intakeInterval'}
                                   label={'intakeInterval'}
                                   className={classes.textField}
                                   value={medicalPlanToAdd.intakeInterval}
                                   onChange={handleChange}/>
                    </Row>
                    <Row>
                        <div className={classes.textField}>
                            <InputLabel htmlFor="patientSelect"
                                        className={classes.inputLabel}>Patient</InputLabel>
                            <Select
                                inputProps={{
                                    id: 'patientSelect'
                                }}
                                name={'patient-id'}
                                onChange={handleChange}>
                                {patients.map((patient) => (
                                    <MenuItem key={patient.id}
                                              value={patient.id}>
                                        {patient.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </Row>
                    <Row>
                        <div className={classes.textField}>
                            <InputLabel htmlFor="medicationSelect"
                                        className={classes.inputLabel}>Medications</InputLabel>
                            <Select
                                inputProps={{
                                    id: 'medicationSelect'
                                }}
                                name={'medication-ids'}
                                multiple
                                style={{marginLeft: 20}}
                                value={selectedMedications}
                                onChange={handleChangeMultiple}
                                renderValue={(selected) => (
                                    <div className={classes.chips}>
                                        {selected.map((value) => (
                                            <Chip key={value}
                                                  label={value}
                                                  className={classes.chip}/>
                                        ))}
                                    </div>
                                )}>
                                {medications.map((medication) => (
                                    <MenuItem key={medication.id}
                                              value={medication.name}>
                                        {medication.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                            onClick={createMedicationPlan}>Save</Button>
                    <Button color="danger"
                            onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </Modal>}
        </Fragment>
    );
});