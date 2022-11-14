#!/bin/sh

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  echo "[Scripts] Port 3000 already in use, cannot launch web"
else
  pwd=$(pwd)
  $(cd ../web && yarn run dev) & $(cd ../emulator && /bin/zsh ./run.sh) &
  pid=$!
  echo "background process $pid started"

  onCtrlC() {
    ./kill_web.sh
    echo "[Scripts] Shutting Down Web"
    wait
    cd ../emulator && ./kill.sh
    echo "[Scripts] Shutting Down Emulators"
    wait
  }

  trap onCtrlC INT

  # wait for all background processes to terminate
  wait
fi