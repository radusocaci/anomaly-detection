import React, {Fragment, useEffect, useState} from 'react';

import MaterialTable from 'material-table';
import axios from 'axios';
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import styles from '../../commons/styles/project-style.css';
import authHeader from '../../commons/auth-header';

export default ({tableIcons}) => {
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
        }
    ];

    const [data, setData] = useState([]);
    const [medicalPlan, setMedicalPlan] = useState(null);
    const [collapseForm, setCollapseForm] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem('username');
        axios.get(`/medical-plan/${username}`, {headers: authHeader()})
            .then(res => {
                setData(res.data);
            });
    }, []);

    const handleRowClick = (selectedRow) => {
        console.log(selectedRow);
        setMedicalPlan(data.find(data => data.id === selectedRow.id));
        setCollapseForm(!collapseForm);
    };

    return (
        <Fragment>
            <MaterialTable
                title="Medication Plan Manager"
                columns={columns}
                data={data}
                icons={tableIcons}
                onRowClick={(evt, selectedRow) => handleRowClick(selectedRow)}
                options={{
                    headerStyle: {
                        textAlign: 'center'
                    }
                }}
            />
            {medicalPlan && <Modal isOpen={collapseForm}
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
                        <Col xs="3"> To : </Col> <Col xs="auto"
                                                      className={styles.modalText}>{medicalPlan.treatmentEndDate} </Col>
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
        </Fragment>
    );
}