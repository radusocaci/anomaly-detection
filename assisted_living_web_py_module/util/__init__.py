import datetime

from dateutil.parser import *


def parse_input_data(activity_list):
    activity_labels_local = []
    activities_per_day_local = []
    activities_per_day_with_timestamps = []
    current_day_activities = []
    current_day_activities_with_timestamp = []
    current_day = 0

    for row in activity_list:
        if row['name'] not in activity_labels_local:
            activity_labels_local.append(row['name'])

        dateS = parse(row['startTime'])  # first timestamp
        dateE = parse(row['endTime'])  # second timestamp
        activity_label_duration_tuple = (row['name'], dateE - dateS)
        activity_label_duration_tuple_with_timestamp = (row['name'], row['startTime'], row['endTime'])

        if current_day == 0:  # assign current day for first pass
            current_day = dateS.day

        if current_day == dateS.day:  # add activity tuple to current day list of activities
            current_day_activities.append(activity_label_duration_tuple)
            current_day_activities_with_timestamp.append(activity_label_duration_tuple_with_timestamp)
        else:  # update activity matrix and current day
            current_day = dateS.day
            activities_per_day_local.append(current_day_activities)
            activities_per_day_with_timestamps.append(current_day_activities_with_timestamp)
            current_day_activities = [activity_label_duration_tuple]
            current_day_activities_with_timestamp = [activity_label_duration_tuple_with_timestamp]

    activities_per_day_local.append(current_day_activities)  # append last day to activity matrix
    activities_per_day_with_timestamps.append(current_day_activities_with_timestamp)

    return activity_labels_local, activities_per_day_local, activities_per_day_with_timestamps


def prepare_output_days(anomaly_check_activities_per_day_with_timestamp_local,
                        order_anomalous_days_indices,
                        time_anomalous_days_indices):
    payload = []
    anomalous_days_indices = order_anomalous_days_indices + time_anomalous_days_indices

    for index, day in enumerate(anomaly_check_activities_per_day_with_timestamp_local):
        for activity_timestamp_tuple in day:
            payload.append({
                'name': activity_timestamp_tuple[0],
                'startTime': activity_timestamp_tuple[1],
                'endTime': activity_timestamp_tuple[2],
                'anomaly': True if index in anomalous_days_indices else False,
                'order-anomaly': True if index in order_anomalous_days_indices else False
            })

    return payload


def prepare_output_baseline(baseline_day):
    payload = []
    initial_time = datetime.datetime(1900, 1, 1, 7, 0, 0)
    final_time = datetime.datetime(1900, 1, 1, 23, 59, 59)

    for activity_duration_tuple in baseline_day:
        start_time = initial_time
        end_time = initial_time + activity_duration_tuple[1] \
            if initial_time + activity_duration_tuple[1] < final_time \
            else final_time
        initial_time = initial_time + activity_duration_tuple[1]

        payload.append({
            'name': activity_duration_tuple[0],
            'startTime': f"{start_time:%Y-%m-%dT%H:%M}",
            'endTime': f"{end_time:%Y-%m-%dT%H:%M}",
            'anomaly': False,
            'order-anomaly': False
        })

    return payload
