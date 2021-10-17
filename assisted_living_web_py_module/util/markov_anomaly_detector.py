import datetime
import math
from itertools import groupby

import numpy as np

from util.markov_constants import DURATION_CONFIDENCE
from util.markov_constants import LENGTH_PROBABILITY_WEIGHT, END_PROBABILITY_WEIGHT, SECONDS_PER_MINUTE


def compute_markov_model(nr_activities_distinct, activities_per_day_local, activity_label_index_dict_local):
    markov_model_local = np.zeros((nr_activities_distinct, nr_activities_distinct))
    activity_count_local = np.zeros(nr_activities_distinct, int)  # frequency array to count activities

    for i in range(len(activities_per_day_local)):
        for j in range(len(activities_per_day_local[i])):
            activity_count_local[activity_label_index_dict_local[activities_per_day_local[i][j][0]]] += 1

            if j > 0:
                markov_model_local[activity_label_index_dict_local[activities_per_day_local[i][j - 1][0]],
                                   activity_label_index_dict_local[activities_per_day_local[i][j][0]]] += 1

    for i in range(nr_activities_distinct):
        if activity_count_local[i] != 0:
            markov_model_local[i] /= activity_count_local[i]  # compute probability by dividing favorable / total cases

    return markov_model_local, activity_count_local


def find_start_and_end_activities(nr_activities_distinct, activities_per_day_local, activity_label_index_dict_local):
    start_likelihood_local, end_likelihood_local = np.zeros(nr_activities_distinct), np.zeros(nr_activities_distinct)

    for i in range(len(activities_per_day_local)):
        start_likelihood_local[activity_label_index_dict_local[activities_per_day_local[i][0][0]]] += 1
        end_likelihood_local[
            activity_label_index_dict_local[activities_per_day_local[i][len(activities_per_day_local[i]) - 1][0]]] += 1

    for i in range(nr_activities_distinct):
        start_likelihood_local[i] /= len(activities_per_day_local)
        end_likelihood_local[i] /= len(activities_per_day_local)

    return start_likelihood_local, end_likelihood_local


def get_length_median(activities_per_day_local):
    len_prob = {}

    for i in range(len(activities_per_day_local)):
        if len(activities_per_day_local[i]) in len_prob:
            len_prob[len(activities_per_day_local[i])] += 1
        else:
            len_prob[len(activities_per_day_local[i])] = 1

    for i in len_prob:
        len_prob[i] = len_prob[i] / len(activities_per_day_local)

    return int(round(np.average(list(len_prob.keys()), weights=list(len_prob.values()))))


def calculate_best_day(markov_model_local, start_likelihood_local, end_likelihood_local,
                       activity_labels_local, len_median_local, use_length):
    best_sequence_local = []

    best_likelihood = max(start_likelihood_local)
    max_index = np.where(start_likelihood_local == best_likelihood)[0][0]

    changed = True
    previous_best_likelihood = best_likelihood
    prev_activity_index = max_index
    while changed:
        best_sequence_local.append(activity_labels_local[prev_activity_index])
        changed = False

        len_discount = np.interp(len(best_sequence_local), [0, len_median_local],
                                 [LENGTH_PROBABILITY_WEIGHT, 0]) if use_length else 0
        best_likelihood *= (end_likelihood_local[prev_activity_index] * END_PROBABILITY_WEIGHT - len_discount)
        for i in range(len(activity_labels_local)):
            if best_likelihood < previous_best_likelihood * markov_model_local[prev_activity_index][i]:
                changed = True
                best_likelihood = previous_best_likelihood * markov_model_local[prev_activity_index][i]
                max_index = i

        previous_best_likelihood = best_likelihood
        prev_activity_index = max_index

    return np.array(best_sequence_local)


def compute_entropy(markov_model_local, activity_count_local, activity_sequence, activity_label_index_dict_local):
    total_activities = np.sum(activity_count_local)
    entropy_local = 0.

    for i in range(len(activity_sequence) - 1):
        start_activity_index = activity_label_index_dict_local[activity_sequence[i][0]]
        end_activity_index = activity_label_index_dict_local[activity_sequence[i + 1][0]]

        if markov_model_local[start_activity_index][end_activity_index] != 0:
            entropy_local += markov_model_local[start_activity_index][end_activity_index] \
                             * math.log(markov_model_local[start_activity_index][end_activity_index]) \
                             * (activity_count_local[start_activity_index] / total_activities)

    return -entropy_local


def calculate_confidence_interval(baseline_local, activities_per_day_local,
                                  markov_model_local, activity_count_local, activity_label_index_dict_local):
    nr_days = len(activities_per_day_local)
    baseline_entropy_local = compute_entropy(markov_model_local, activity_count_local, baseline_local,
                                             activity_label_index_dict_local)
    confidence_indices, sigma = 2, 0

    for i in range(nr_days):
        day_entropy = compute_entropy(markov_model_local, activity_count_local, activities_per_day_local[i],
                                      activity_label_index_dict_local)
        sigma += (day_entropy - baseline_entropy_local) ** 2

    sigma /= nr_days
    sigma = math.sqrt(sigma)

    delta_local = confidence_indices * sigma / math.sqrt(nr_days)

    return baseline_entropy_local, delta_local


def compute_average_duration(nr_activities_distinct, activities_per_day_local, activity_label_index_dict_local):
    avg_duration_local = np.zeros(nr_activities_distinct, int)
    activity_count_local = np.zeros(nr_activities_distinct, int)

    for i in range(len(activities_per_day_local)):
        for j in range(len(activities_per_day_local[i])):
            activity_count_local[activity_label_index_dict_local[activities_per_day_local[i][j][0]]] += 1

            avg_duration_local[activity_label_index_dict_local[activities_per_day_local[i][j][0]]] += \
                (activities_per_day_local[i][j][1].total_seconds() / SECONDS_PER_MINUTE)

    avg_duration_local = [
        math.floor(avg_duration_local[i] / len(activities_per_day_local)) for i in range(nr_activities_distinct)
        if activity_count_local[i] != 0
    ]

    return np.array(avg_duration_local)


def compare_days_duration(day1_local, day2_local, activity_label_index_dict_local):
    i, j, similarity, sum_day1_squared, sum_day2_squared = 0, 0, 0, 0, 0

    baseline_sorted_durations = []
    for activity_duration_tuple in day2_local:
        baseline_sorted_durations.append(day1_local[activity_label_index_dict_local[activity_duration_tuple[0]]])

    while True:
        if i == len(day1_local) or j == len(day2_local):
            break

        a1 = baseline_sorted_durations[i]
        a2 = day2_local[i]

        similarity += (a1 / SECONDS_PER_MINUTE) * (a2[1].total_seconds() / SECONDS_PER_MINUTE)
        sum_day1_squared += (a1 / SECONDS_PER_MINUTE) ** 2
        sum_day2_squared += (a2[1].total_seconds() / SECONDS_PER_MINUTE) ** 2

        i += 1
        j += 1

    similarity /= (math.sqrt(sum_day1_squared) * math.sqrt(sum_day2_squared))

    return similarity


def classify_using_ordering_dimension(baseline_entropy_local, delta_local,
                                      activities_per_day_local, markov_model_local,
                                      activity_count_local, activity_label_index_dict_local):
    appropriate_days, appropriate_days_indices, anomalous_days = [], [], []

    for i in range(len(activities_per_day_local)):
        day_entropy = compute_entropy(markov_model_local, activity_count_local, activities_per_day_local[i],
                                      activity_label_index_dict_local)

        if abs(day_entropy - baseline_entropy_local) <= delta_local:
            appropriate_days.append(activities_per_day_local[i])
            appropriate_days_indices.append(i)
        else:
            anomalous_days.append(i)

    return appropriate_days, appropriate_days_indices, anomalous_days


def classify_using_time_dimension(activity_labels_length, time_based_anomaly_detection_days,
                                  activity_label_index_dict, days_respecting_baseline):
    anomalous_days = []
    average_duration = compute_average_duration(activity_labels_length, time_based_anomaly_detection_days,
                                                activity_label_index_dict)

    for index, appropriate_day in enumerate(days_respecting_baseline):
        sorted_by_activity = sorted(appropriate_day, key=lambda x: x[0])
        activity_duration_tuples = [
            (key, sum([j for i, j in group], datetime.timedelta(seconds=0))) for key, group
            in groupby(sorted_by_activity, key=lambda x: x[0])
        ]

        duration_similarity = compare_days_duration(average_duration, activity_duration_tuples,
                                                    activity_label_index_dict)

        if duration_similarity < DURATION_CONFIDENCE:
            anomalous_days.append(index)

    return anomalous_days


def augment_baseline_with_duration(baseline_day, activity_label_index_dict,
                                   nr_activities_distinct, activities_per_day_local):
    baseline_day_duration_tuples = []
    average_duration = \
        compute_average_duration(nr_activities_distinct, activities_per_day_local, activity_label_index_dict)

    for i in range(len(baseline_day)):
        baseline_day_duration_tuples.append((
            baseline_day[i],
            datetime.timedelta(minutes=int(average_duration[activity_label_index_dict[baseline_day[i]]]))
        ))

    return baseline_day_duration_tuples
