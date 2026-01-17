set -eu
# просто запустить nginx как PID 1
exec nginx -g 'daemon off;'