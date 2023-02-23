deploy:
	git add .
	git commit -am "makefile"
	git push origin main

build:
	docker image rm react-app
	docker build -t varenyam/jiva:react-app .
	docker push varenyam/jiva:react-app