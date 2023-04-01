# git submodule add https://github.com/kabeer11000/kabeer-chats.git source-web
# git clone https://github.com/kabeer11000/kabeer-chats.git --depth 1 --branch native ./web-stable

function git_sparse_clone() (
  rurl="$1" localdir="$2" && shift 2

  mkdir -p "$localdir"
  cd "$localdir"

  git init
  git remote add -f origin "$rurl"

  git config core.sparseCheckout true

  # Loops over remaining args
  for i; do
    echo "$i" >> .git/info/sparse-checkout
  done

  git pull origin master
)
# function foo() {
  # Removes .git folder and moves files to original folder
# }
# git_sparse_clone "http://github.com/kabeer11000/chats/" "../source-web/" "/web/"
curl https://codeload.github.com/kabeer11000/chats/tar.gz/master | \
  tar -xz --strip=2 next.js-master/web ../source-web

