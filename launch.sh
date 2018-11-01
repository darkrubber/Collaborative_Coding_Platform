#!/bin/bash
redis-server
(cd oj-client && ng build )&
(cd oj-server && npm start) &
(cd executor && python3 executor_server.py 5000)&
