import datetime
import pytz

tz = pytz.timezone('Europe/Moscow')


def astz(dt: datetime.datetime):
    return dt.astimezone(tz)


def get_timezone_now():
    return datetime.datetime.now().astimezone(tz)


def is_yesterday_two_dates(date1: datetime.date, date2: datetime.date = datetime.date.today()):
    return date2 - date1 == datetime.timedelta(days=1)


def is_today(date1: datetime.date, date2: datetime.date = datetime.date.today()):
    return date2 - date1 == datetime.timedelta(days=0)
