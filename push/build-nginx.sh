curl -OL https://ftp.exim.org/pub/pcre/pcre-8.45.tar.gz
tar -xf pcre-8.45.tar.gz && rm pcre-8.45.tar.gz

# Download and extract the OpenSSL source files
curl -OL http://www.openssl.org/source/openssl-1.1.1m.tar.gz
tar -xf openssl-1.1.1m.tar.gz && rm openssl-1.1.1m.tar.gz

# Download and extract the NGINX source files
curl -OL http://nginx.org/download/nginx-1.20.2.tar.gz
tar -xf nginx-1.20.2.tar.gz && rm nginx-1.20.2.tar.gz
# List the files/folders in the working directory
echo "configuring nginx"

cd nginx-1.20.2 || exit

./configure --with-pcre=../pcre-8.45/ --with-http_ssl_module --with-openssl=../openssl-1.1.1m/

# Compile NGINX
make
# Install NGINX
sudo make install

echo "successfully installed nginx"

# Append NGINX to the /etc/paths file
echo /usr/local/nginx/sbin | sudo tee -a /etc/paths