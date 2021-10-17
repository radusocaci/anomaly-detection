import os

from flask import Flask, jsonify
from flask import request

from util import parse_input_data, prepare_output_days, prepare_output_baseline
from util.markov_anomaly_detector import *
from util.markov_constants import *

app = Flask(__name__)


@app.route('/check-anomaly', methods=['POST'])
def check_for_anomalies():
    routine_labels, routine_activities_per_day, _ = parse_input_data(request.json['routine-data'])
    anomaly_check_labels, anomaly_check_activities_per_day, anomaly_check_activities_per_day_with_timestamp = \
        parse_input_data(request.json['anomaly-check-data'])
    activity_labels = list(set(routine_labels) | set(anomaly_check_labels))
    activity_label_index_dict = {k: v for v, k in enumerate(activity_labels)}
    markov_model, activity_count = compute_markov_model(len(activity_labels),
                                                        routine_activities_per_day,
                                                        activity_label_index_dict)
    start_likelihood, end_likelihood = find_start_and_end_activities(len(activity_labels),
                                                                     routine_activities_per_day,
                                                                     activity_label_index_dict)
    len_median = get_length_median(routine_activities_per_day)
    baseline_day = calculate_best_day(markov_model, start_likelihood, end_likelihood,
                                      activity_labels, len_median, False)
    if np.interp(len(baseline_day), [0, len_median], [LENGTH_PROBABILITY_WEIGHT, 0]) > LENGTH_MEDIAN_DEVIATION:
        baseline_day = calculate_best_day(markov_model, start_likelihood, end_likelihood,
                                          activity_labels, len_median, True)
    baseline_day_duration_tuples = \
        [(baseline_activity, datetime.timedelta(hours=1)) for baseline_activity in baseline_day]
    baseline_entropy, delta = calculate_confidence_interval(baseline_day_duration_tuples, routine_activities_per_day,
                                                            markov_model,
                                                            activity_count, activity_label_index_dict)
    time_based_anomaly_detection_days, _, _ = \
        classify_using_ordering_dimension(baseline_entropy, delta, routine_activities_per_day,
                                          markov_model, activity_count, activity_label_index_dict)
    days_respecting_baseline, days_respecting_baseline_indices, order_dimension_anomalous_days = \
        classify_using_ordering_dimension(baseline_entropy, delta, anomaly_check_activities_per_day,
                                          markov_model, activity_count, activity_label_index_dict)
    time_dimension_anomalous_days = []
    if len(time_based_anomaly_detection_days) != 0 and len(days_respecting_baseline) != 0:
        time_dimension_anomalous_days = \
            classify_using_time_dimension(len(activity_labels), time_based_anomaly_detection_days,
                                          activity_label_index_dict, days_respecting_baseline)
    anomalous_days_payload = \
        prepare_output_days(anomaly_check_activities_per_day_with_timestamp,
                            order_dimension_anomalous_days,
                            list(map(lambda x: days_respecting_baseline_indices[x], time_dimension_anomalous_days)))
    baseline_payload = prepare_output_baseline(
        augment_baseline_with_duration(baseline_day, activity_label_index_dict,
                                       len(activity_labels), time_based_anomaly_detection_days))

    return jsonify(anomalous_days_payload + baseline_payload)


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0:$PORT')
