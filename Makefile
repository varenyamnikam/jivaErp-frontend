deploy:
	git add .
	git commit -am "makefile"
	git push origin main

build:
	docker image rm varenyam/jiva:react-app
	docker build --no-cache -t varenyam/jiva:react-app .
	docker image push varenyam/jiva:react-app