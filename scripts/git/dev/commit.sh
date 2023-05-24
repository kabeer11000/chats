git add .

a=$1
if [ $# -eq 0 ]
  then
    a=$(openssl rand -hex 12)
fi
#if [[ $b -eq 5 ]]; then a="$c"; else a="$d"; fi
git commit -m "$a"
git push origin development
