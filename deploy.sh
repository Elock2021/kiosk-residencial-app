#!/bin/bash
while [[ "$#" -gt 0 ]]
do
case $1 in
  -d|--deploy)
    deploy="$2"
    ;;
  -s|--send)
    send="send=$2"
    ;;
esac
shift
done

folder_server="app-locker"
folder_server_staging="app-locker"
folder_server_panama="app-locker"

ip_server_pro="18.230.11.171"
ip_server_sta="18.228.12.187"
ip_server_panama="54.232.142.145"

key="elock_new.pem"

serverProDirFront="/var/www/${folder_server}/build"
serverStaDirFront="/var/www/${folder_server_staging}/build"
serverPanamaDirFront="/var/www/${folder_server_panama}/build"

serverPro="ubuntu@${ip_server_pro}"
serverSta="ubuntu@${ip_server_sta}"
serverPanama="ubuntu@${ip_server_panama}"

serverProHome=":/home/ubuntu/"
keyPro="~/.ssh/${key}"

f-deploy-frontend-pro () {
	yarn build:pro
	rm build.zip
	zip -r build.zip build/* .htaccess
	scp -i ${keyPro} build.zip ${serverPro}${serverProHome}
	ssht=" unzip build.zip"
	ssht+=" && rm build.zip"
	ssht+=" && sudo mv build build-front"
	ssht+=" && sudo chown -R ubuntu.ubuntu ${serverProDirFront}"
	ssht+=" && sudo rm -Rf ${serverProDirFront}/*"
	ssht+=" && sudo mv build-front/* ${serverProDirFront}/"
	ssht+=" && sudo cp .htaccess ${serverProDirFront}/.htaccess"
	ssht+=" && sudo rm -Rf build-front"
	ssht+=" && sudo rm -Rf build"
	#ssht+=" && sudo cp ~/.htaccess-front-admin ${dirFront}/.htaccess"
	# siempre agrega los archivo al grupo www-data
	ssht+=" && sudo chown -R www-data:www-data ${serverProDirFront}"
  	ssh -t -i ${keyPro}  ${serverPro} "$ssht"
}

f-deploy-frontend-sta () {
	yarn build:sta
	rm build.zip
	zip -r build.zip build/* .htaccess
	scp -i ${keyPro} build.zip ${serverSta}${serverProHome}
	ssht=" unzip build.zip"
	ssht+=" && rm build.zip"
	ssht+=" && sudo mv build build-front"
	ssht+=" && sudo chown -R ubuntu.ubuntu ${serverStaDirFront}"
	ssht+=" && sudo rm -Rf ${serverStaDirFront}/*"
	ssht+=" && sudo mv build-front/* ${serverStaDirFront}/"
	ssht+=" && sudo cp .htaccess ${serverStaDirFront}/.htaccess"
	ssht+=" && sudo rm -Rf build-front"
	ssht+=" && sudo rm -Rf build"
	#ssht+=" && sudo cp ~/.htaccess-front-admin ${dirFront}/.htaccess"
	# siempre agrega los archivo al grupo www-data
	ssht+=" && sudo chown -R www-data:www-data ${serverStaDirFront}"
  	ssh -t -i ${keyPro}  ${serverSta} "$ssht"
}

f-deploy-frontend-panama () {
	yarn build:panama
	rm build.zip
	zip -r build.zip build/* .htaccess
	scp -i ${keyPro} build.zip ${serverPanama}${serverProHome}
	ssht=" unzip build.zip"
	ssht+=" && rm build.zip"
	ssht+=" && sudo mv build build-front"
	ssht+=" && sudo chown -R ubuntu.ubuntu ${serverPanamaDirFront}"
	ssht+=" && sudo rm -Rf ${serverPanamaDirFront}/*"
	ssht+=" && sudo mv build-front/* ${serverPanamaDirFront}/"
	ssht+=" && sudo cp .htaccess ${serverPanamaDirFront}/.htaccess"
	ssht+=" && sudo rm -Rf build-front"
	ssht+=" && sudo rm -Rf build"
	#ssht+=" && sudo cp ~/.htaccess-front-admin ${dirFront}/.htaccess"
	# siempre agrega los archivo al grupo www-data
	ssht+=" && sudo chown -R www-data:www-data ${serverPanamaDirFront}"
  	ssh -t -i ${keyPro}  ${serverPanama} "$ssht"
}

case "$deploy" in

	"frontend-pro")
		f-deploy-frontend-pro
	;;
	"frontend-sta")
		f-deploy-frontend-sta
	;;
	"frontend-panama")
		f-deploy-frontend-panama
	;;
esac