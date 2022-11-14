lsof -t -i:4000 -i:4001 | xargs kill -9
echo "[Emulator Utility] all emulators killed"