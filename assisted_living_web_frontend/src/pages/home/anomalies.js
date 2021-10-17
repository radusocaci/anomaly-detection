import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import authHeader from '../../commons/auth-header';
import Select from 'react-select';
import {UserType} from '../../commons/UserType';
import Chart from 'react-google-charts';
import {UncontrolledAlert} from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import {CircularProgress} from '@material-ui/core';

export default () => {

    const [patients, setPatients] = useState([]);
    const [orderAnomalies, setOrderAnomalies] = useState([]);
    const [timeAnomalies, setTimeAnomalies] = useState([]);
    const [regularDays, setRegularDays] = useState([]);
    const [baseline, setBaseline] = useState([]);
    const [pieClassifications, setPieClassifications] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [patientId, setPatientId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem('username');
        const userType = localStorage.getItem('userType');

        axios.get('/patient', {headers: authHeader()})
            .then(res => {
                if (userType === UserType.CAREGIVER) {
                    setPatients(res.data.filter(item => item.caregiver.username === username));
                } else {
                    setPatients(res.data);
                }
            })
            .catch(error => {
                setErrorStatus(error.response.status);
            });
    }, []);

    const prepareChartData = (anomaliesPayload, classificationLabel, pieTemp) => {
        let chartData = anomaliesPayload.map(anomaly => {
            const startTime = new Date(anomaly.startTime);
            const endTime = new Date(anomaly.endTime);
            const date = new Date(new Date(startTime).setHours(0, 0, 0, 0));

            startTime.setFullYear(0, 0, 0);
            endTime.setFullYear(0, 0, 0);

            return [`${date.toDateString()}`, anomaly.activity, startTime, endTime];
        });

        if (classificationLabel !== 'Baseline') {
            pieTemp.push([classificationLabel, [...new Set(chartData.map(data => data[0]))].length]);
        }

        return chartData;
    };

    const handlePatientSelect = (event) => {
        setLoading(true);
        setErrorStatus(0);
        setPatientId(event.id);
        axios.get('/activities/' + event.id, {headers: authHeader()})
            .then(res => {
                if (res.data.length === 0) {
                    setErrorStatus(400);
                }

                let pieTemp = [];
                let activities = res.data.filter(x => new Date(x.startTime).getFullYear() !== 1900);

                setOrderAnomalies(prepareChartData(activities.filter(x => x.anomaly && x.orderAnomaly), 'Order Anomalies', pieTemp));
                setTimeAnomalies(prepareChartData(activities.filter(x => x.anomaly && !x.orderAnomaly), 'Time Anomalies', pieTemp));
                setRegularDays(prepareChartData(activities.filter(x => !x.anomaly), 'Regular Days', pieTemp));
                let baselineData = prepareChartData(res.data.filter(x => new Date(x.startTime).getFullYear() === 1900), 'Baseline', pieTemp);
                baselineData.forEach(x => x[0] = 'Routine');
                setBaseline(baselineData);

                setPieClassifications(pieTemp);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    };

    return (
        <Fragment>
            <div style={{
                width: '50%',
                margin: 'auto',
                marginBottom: '20px'
            }}>
                <Select
                    isSearchable={true}
                    getOptionLabel={option => option.name}
                    options={patients}
                    value={patientId}
                    onChange={event => handlePatientSelect(event)}/>
            </div>
            {
                errorStatus > 0 &&
                <div style={{
                    width: 550,
                    margin: 'auto'
                }}><br/>
                    <UncontrolledAlert color="danger">
                        <span style={{textAlign: 'center'}}>There are no anomalies for this patient</span>
                    </UncontrolledAlert></div>
            }
            {(patientId != null && errorStatus === 0 && !loading) && (
                <Fragment>
                    {(regularDays.length !== 0) && (<Fragment>
                        <Typography variant={'h5'}
                                    style={{marginBottom: '20px'}}>Regular Days</Typography>
                        <Chart
                            chartType="Timeline"
                            loader={<div>Loading Chart</div>}
                            data={[
                                [
                                    {
                                        type: 'string',
                                        id: 'Day'
                                    },
                                    {
                                        type: 'string',
                                        id: 'Activity'
                                    },
                                    {
                                        type: 'date',
                                        id: 'Start Time'
                                    },
                                    {
                                        type: 'date',
                                        id: 'End Time'
                                    },
                                ],
                                ...regularDays
                            ]}
                            rootProps={{'data-testid': '1'}}/>
                    </Fragment>)}
                    {(orderAnomalies.length !== 0) && (<Fragment>
                        <Typography variant={'h5'}
                                    style={{marginBottom: '20px'}}>Order-based Anomalous Days</Typography>
                        <Chart
                            chartType="Timeline"
                            loader={<div>Loading Chart</div>}
                            data={[
                                [
                                    {
                                        type: 'string',
                                        id: 'Day'
                                    },
                                    {
                                        type: 'string',
                                        id: 'Activity'
                                    },
                                    {
                                        type: 'date',
                                        id: 'Start Time'
                                    },
                                    {
                                        type: 'date',
                                        id: 'End Time'
                                    },
                                ],
                                ...orderAnomalies
                            ]}
                            rootProps={{'data-testid': '1'}}/>
                    </Fragment>)}
                    {(timeAnomalies.length !== 0) && (<Fragment>
                        <Typography variant={'h5'}
                                    style={{marginBottom: '20px'}}>Time-based Anomalous Days</Typography>
                        <Chart
                            chartType="Timeline"
                            loader={<div>Loading Chart</div>}
                            data={[
                                [
                                    {
                                        type: 'string',
                                        id: 'Day'
                                    },
                                    {
                                        type: 'string',
                                        id: 'Activity'
                                    },
                                    {
                                        type: 'date',
                                        id: 'Start Time'
                                    },
                                    {
                                        type: 'date',
                                        id: 'End Time'
                                    },
                                ],
                                ...timeAnomalies
                            ]}
                            rootProps={{'data-testid': '1'}}/>
                    </Fragment>)}
                    <div style={{display: 'flex'}}>
                        <div>
                            {(timeAnomalies.length !== 0 || orderAnomalies.length !== 0 || regularDays.length !== 0) &&
                            <Typography variant={'h5'}>Day Classification Distribution</Typography>}
                            <Chart
                                width={'500px'}
                                height={'300px'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Classification', 'Percentage'],
                                    ...pieClassifications
                                ]}
                                options={{
                                    is3D: true,
                                    backgroundColor: '#F5F5F5'
                                }}
                                rootProps={{'data-testid': '2'}}
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            {(baseline.length !== 0) && (<Fragment>
                                <Typography variant={'h5'}
                                            style={{marginBottom: '50px'}}>Routine Day</Typography>
                                <Chart
                                    chartType="Timeline"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        [
                                            {
                                                type: 'string',
                                                id: 'Day'
                                            },
                                            {
                                                type: 'string',
                                                id: 'Activity'
                                            },
                                            {
                                                type: 'date',
                                                id: 'Start Time'
                                            },
                                            {
                                                type: 'date',
                                                id: 'End Time'
                                            },
                                        ],
                                        ...baseline
                                    ]}
                                    rootProps={{'data-testid': '1'}}/>
                            </Fragment>)}
                        </div>
                    </div>
                </Fragment>
            )}
            {loading && (
                <div style={{
                    marginLeft: '49%',
                    marginTop: '50px'
                }}><CircularProgress size={50}/></div>
            )}
        </Fragment>
    );
};