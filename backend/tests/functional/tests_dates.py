import datetime

from src.utils.datetimes import is_yesterday_two_dates


def test_is_yesterday_success():
    date = datetime.date(2025, 12, 31)

    date2 = datetime.date(2026, 1, 1)

    assert is_yesterday_two_dates(date, date2) is True

    date = datetime.date(2025, 1, 31)

    date2 = datetime.date(2026, 6, 1)

    assert is_yesterday_two_dates(date, date2) is False


def test_is_yesterday_fail():
    date = datetime.date(2025, 12, 31)

    date2 = datetime.date(2026, 1, 2)

    assert is_yesterday_two_dates(date, date2) is False
