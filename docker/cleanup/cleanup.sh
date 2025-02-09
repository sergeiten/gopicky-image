#!/bin/bash

find /uploads/* -mmin +60 -type d -exec rm -rdf {} \;
