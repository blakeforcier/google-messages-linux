#!/usr/bin/env bash
cd /home/bforce/.local/share/google-messages-desktop || exit 1
exec ./node_modules/.bin/electron . "$@"
