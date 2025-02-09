FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y install -qq --force-yes cron

COPY docker/cleanup/cleanup.sh /root/cleanup.sh

RUN chmod 0644 /root/cleanup.sh

RUN touch /var/log/cron.log

RUN crontab -l | { cat; echo "* * * * * bash /root/cleanup.sh >> /var/log/cron.log 2>&1"; } | crontab -

CMD cron -f && tail -f /var/log/cron.log
