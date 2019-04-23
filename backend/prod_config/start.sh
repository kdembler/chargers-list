#!/usr/bin/env bash
service nginx start
uwsgi prod_config/uwsgi.ini
