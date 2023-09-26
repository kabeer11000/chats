git add .

a=$1
if [ $# -eq 0 ]
  then
    a=$(openssl rand -hex 6)
fi
#if [[ $b -eq 5 ]]; then a="$c"; else a="$d"; fi
git commit -m "$a - Via: Auto Commit & Push Script | scripts/git/dev/commit.sh"
git push origin development
