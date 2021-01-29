import math

SECONDS = 1
MINUTES = SECONDS * 60
HOURS = MINUTES * 60
DAYS = HOURS * 24
WEEKS = DAYS * 7
MONTHS = DAYS * 30.4375 # Avg days in a month
YEARS = MONTHS * 12

def calc_relative_time(their_seconds, my_age, their_age):
    ratio = my_age / their_age
    my_seconds = their_seconds * ratio
    return my_seconds

def get_name(number):
    names = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine"
    ]
    rounded_number = math.floor(number)
    if (rounded_number >= len(names)):
        return str(rounded_number)
    
    return names[rounded_number]

def format_time_span(seconds=0):
    def format(time, label):
        s = "s" if time >= 2 else ""
        return get_name(time) + " " + label + s
    """
    Get an int() number of seconds
    and return a pretty string
    like 'two hours', 'seven weeks', 'one year', etc
    """
    if (seconds < 60):
        return format(seconds, "second")
    
    minutes = seconds / 60

    if (minutes < 60):
        return format(minutes, "minute")

    hours = minutes / 60

    if (hours < 24):
        return format(hours, "hour")

    days = hours / 24

    if (days < 7):
        return format(days, "day")

    weeks = days / 7

    if (weeks < 8):
        return format(weeks, "week")

    months = days / 30.4375 # Avg days in a month

    if (months < 24):
        return format(months, "month")

    years = months / 12

    return format(years, "year")

def get_time(number, unit):
    return number * unit

def main(my_age, their_age, time):
    relative_time = calc_relative_time(time, my_age, their_age)
    formatted_time = format_time_span(time)
    formatted_relative_time = format_time_span(relative_time)
    print("If I'm " + str(my_age) + " and they're " + str(their_age) + ", then " + formatted_time + " to me is like " + formatted_relative_time + " to them.")

main(my_age = 31, their_age = 4, time = get_time(1, YEARS))