import datetime
import pytz

tz = pytz.timezone('Europe/Moscow')


def astz(dt: datetime.datetime):
    return dt.astimezone(tz)


def get_timezone_now():
    return datetime.datetime.now().astimezone(tz)


def is_today(dt: datetime) -> bool:
    now = datetime.datetime.now(tz=dt.tzinfo)
    return dt.date() == now.date()


def is_yesterday(dt: datetime) -> bool:
    now = datetime.datetime.now(tz=dt.tzinfo)
    return now.date() - dt.date() == datetime.timedelta(days=1)
