from os import getenv

from django.conf import settings
from django.contrib.auth.middleware import RemoteUserMiddleware
from django.db import connection
from django.utils import translation


class CustomRemoteUser(RemoteUserMiddleware):
    header = getenv('PROXY_HEADER', 'HTTP_REMOTE_USER')


class LocaleActivationMiddleware:
    """
    Middleware to activate the correct language for each request.
    This ensures that the language setting from the session is properly applied.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Activate language from session or use default
        language = translation.get_language_from_request(request)
        translation.activate(language)
        request.LANGUAGE_CODE = language

        response = self.get_response(request)

        # Set language cookie if needed
        language = translation.get_language()
        if hasattr(request, 'session'):
            request.session.setdefault('django_language', language)

        response.setdefault('Content-Language', language)

        return response


"""
Gist code by vstoykov, you can check his original gist at:
https://gist.github.com/vstoykov/1390853/5d2e8fac3ca2b2ada8c7de2fb70c021e50927375
Changes:
Ignoring static file requests and a certain useless admin request from triggering the logger.
Updated statements to make it Python 3 friendly.
"""


def terminal_width():
    """
    Function to compute the terminal width.
    """
    width = 0
    try:
        import fcntl
        import struct
        import termios
        s = struct.pack('HHHH', 0, 0, 0, 0)
        x = fcntl.ioctl(1, termios.TIOCGWINSZ, s)
        width = struct.unpack('HHHH', x)[1]
    except Exception:
        pass
    if width <= 0:
        try:
            width = int(getenv['COLUMNS'])
        except Exception:
            pass
    if width <= 0:
        width = 80
    return width


def SqlPrintingMiddleware(get_response):
    def middleware(request):
        response = get_response(request)
        if (
            not settings.DEBUG
            or len(connection.queries) == 0
            or request.path_info.startswith(settings.MEDIA_URL)
            or '/admin/jsi18n/' in request.path_info
        ):
            return response

        indentation = 2
        print("\n\n%s\033[1;35m[SQL Queries for]\033[1;34m %s\033[0m\n" % (" " * indentation, request.path_info))
        width = terminal_width()
        total_time = 0.0
        for query in connection.queries:
            nice_sql = query['sql'].replace('"', '').replace(',', ', ')
            sql = "\033[1;31m[%s]\033[0m %s" % (query['time'], nice_sql)
            total_time = total_time + float(query['time'])
            while len(sql) > width - indentation:
                # print("%s%s" % (" " * indentation, sql[:width - indentation]))
                sql = sql[width - indentation:]
            # print("%s%s\n" % (" " * indentation, sql))
        replace_tuple = (" " * indentation, str(total_time))
        print("%s\033[1;32m[TOTAL TIME: %s seconds]\033[0m" % replace_tuple)
        print("%s\033[1;32m[TOTAL QUERIES: %s]\033[0m" % (" " * indentation, len(connection.queries)))
        return response
    return middleware
