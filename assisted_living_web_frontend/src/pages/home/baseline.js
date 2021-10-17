import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import authHeader from '../../commons/auth-header';
import Select from 'react-select';
import Chart from 'react-google-charts';
import {Button, UncontrolledAlert} from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import {CircularProgress} from '@material-ui/core';
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import * as Papa from "papaparse";

export default () => {

    const [baseline, setBaseline] = useState([]);
    const [f1, setF1] = useState('');
    const [baselineGA, setBaselineGA] = useState([]);
    const [f2, setF2] = useState('');
    const [baselineDO, setBaselineDO] = useState([]);
    const [f3, setF3] = useState('');
    const [baselineDC, setBaselineDC] = useState([]);
    const [f4, setF4] = useState('');
    const [pieClassifications, setPieClassifications] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [patientId, setPatientId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


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
    const handleBaselineUpload = (event) => {
        const file = event.target.files[0];

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                let payload = {
                    'patient-id': null,
                    activities: results.data.filter(activity => activity['Activity name'] != null)
                };

                axios.post('/baseline/test-algorithms', payload, {headers: authHeader()})
                    .then(res => {
                        if (res.data.length === 0) {
                            setErrorStatus(400);
                        }
                        let pieTemp = [];
                        let baselineData = prepareChartData(res.data.filter(x => new Date(x.startTime).getFullYear() === 2000), 'Baseline', pieTemp);
                        baselineData.forEach(x => x[0] = 'Routine');
                        setBaseline(baselineData);
                        console.log(res.data.filter(x => new Date(x.startTime).getFullYear() === 1000)[0].activity);
                        setF1(res.data.filter(x => new Date(x.startTime).getFullYear() === 1000)[0].activity);
                        let baselineDataGA = prepareChartData(res.data.filter(x => new Date(x.startTime).getFullYear() === 2001), 'Baseline', pieTemp);
                        baselineDataGA.forEach(x => x[0] = 'RoutineGA');
                        setBaselineGA(baselineDataGA);
                        setF2(res.data.filter(x => new Date(x.startTime).getFullYear() === 1001)[0].activity);
                        let baselineDataDO = prepareChartData(res.data.filter(x => new Date(x.startTime).getFullYear() === 2002), 'Baseline', pieTemp);
                        baselineDataDO.forEach(x => x[0] = 'RoutineDO');
                        setBaselineDO(baselineDataDO);
                        setF3(res.data.filter(x => new Date(x.startTime).getFullYear() === 1002)[0].activity);
                        let baselineDataDC = prepareChartData(res.data.filter(x => new Date(x.startTime).getFullYear() === 2003), 'Baseline', pieTemp);
                        baselineDataDC.forEach(x => x[0] = 'RoutineDC');
                        setBaselineDC(baselineDataDC);
                        setF4(res.data.filter(x => new Date(x.startTime).getFullYear() === 1003)[0].activity);


                        setLoading(false);
                    })
                    .catch(error => {
                        setLoading(false)
                        setError(error.response.data);
                        setErrorStatus(error.response.status);
                    });
            }
        });


    };

    return (
        <Fragment >
            <Typography variant={'h3'}
                        style={{marginBottom: '5px'}}>Test the algorithms</Typography>
            <div style={{
                width: '50%',
                margin: 'auto',
                marginBottom: '20px'
            }}>
                <Button onClick={() => {setBaselineDC([]);
                                        setBaseline([]);
                                        setBaselineDO([]);
                                        setBaselineGA([]);
                                        }}>
                    Clear</Button>
                <input type={'file'}
                       id={'baselineTestInput'}
                       onChange={handleBaselineUpload}
                       style={{marginLeft:'1rem'}}
                    />

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
            {(errorStatus === 0 && !loading) && (
                <Fragment>
                    {(baseline.length !== 0) && (<Fragment>
                        <Typography variant={'h5'}
                                    style={{marginBottom: '5px'}}>Markov Model</Typography>
                        <Typography variant={'h7'}
                                    style={{marginBottom: '10px'}}>Fitness: {f1}</Typography>
                        <Chart
                            height={'100px'}
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
                            options = {{tooltip: {trigger: false}}}
                            rootProps={{'data-testid': '1'}}/>

                    </Fragment>)}
                    {(baselineGA.length !== 0) && (<Fragment>
                        <Typography variant={'h5'}
                                    style={{marginBottom: '5px'}}>Genetic Algorithm</Typography>
                        <Typography variant={'h7'}
                                    style={{marginBottom: '10px'}}>Fitness: {f2}</Typography>
                        <Chart
                            height={'100px'}
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
                                ...baselineGA
                            ]}
                            options = {{tooltip: {trigger: false}}}
                            rootProps={{'data-testid': '1'}}/>
                    </Fragment>)}
                    {(baselineDO.length !== 0) && (<Fragment>
                        <Typography variant={'h5'}
                                    style={{marginBottom: '5px'}}>Dynamic Operators</Typography>
                        <Typography variant={'h7'}
                                    style={{marginBottom: '10px'}}>Fitness: {f3}</Typography>
                        <Chart
                            height={'100px'}
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
                                ...baselineDO
                            ]}
                            options = {{tooltip: {trigger: false}}}
                            rootProps={{'data-testid': '1'}}/>
                    </Fragment>)}
                    {(baselineDC.length !== 0) && (<Fragment>
                        <Typography variant={'h5'}
                                    style={{marginBottom: '5px'}}>Dynamic Clustering</Typography>
                        <Typography variant={'h7'}
                                    style={{marginBottom: '10px'}}>Fitness: {f4}</Typography>
                        <Chart
                            height={'100px'}
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
                                ...baselineDC
                            ]}
                            options = {{tooltip: {trigger: false}}}
                            rootProps={{'data-testid': '1'}}/>
                    </Fragment>)}


                </Fragment>
            )}
        </Fragment>
    );
};