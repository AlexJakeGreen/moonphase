#!/usr/bin/env bash

dbus-run-session -- gnome-shell --nested --wayland \
                 2>&1 \
    | grep -P --color=none '==>|JS ERROR|moonphase|TypeError|ReferenceError|Stack trace|  '
