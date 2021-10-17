# Anomaly Detection Service

The main purpose of this project is to be able to detect a person's behavioural anomalies in real time. To achive this goal we rely of sensor data collected from in-home smart sensors/devices and a technique based on the entropy rate and the cosine similarity measurement. In the anomaly detection process we take into consideration both the order of the activities and their duration. 

The service consists of the following components:
- The platform front-end. The front-end application is the interface that the healthcare professionals use to interact with the rest of the medical platform and particularly with the anomaly detection component.
- The platform back-end. The platform back-end handles all the application business logic except for the anomaly detection itself.
- The anomaly detection module. The anomaly detection module integrates the anomaly detection technique and communicates with the back-end.

  ![Conceptual Architecture](https://raw.githubusercontent.com/radusocaci/anomaly-detection/main/Conceptual%20Architecture.png)

The project has been deployed on heroku using a GitLab CD pipeline and Docker. The project can be accessed using [this](https://anomaly-detection-frontend.herokuapp.com/) link. For more information check out the [project synthesis](https://github.com/radusocaci/anomaly-detection/blob/main/thesis_synthesis.pdf) or reach out to me at [radusocaci@gmail.com](mailto:radusocaci@gmail.com?subject=[GitHub]%20Anomaly%20Detection%20Thesis) for the complete documentation.

This project was developed as part of a 2-man team together with **David Demjen**.
