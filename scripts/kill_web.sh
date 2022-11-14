lsof -t -i:3000 -i:3001 -i:3002 -i:3003 | xargs kill -9
lsof -t -i:3000 -i:3001 -i:3002 -i:3003 | xargs kill -9
echo "[Web Utility] all we processes killed"