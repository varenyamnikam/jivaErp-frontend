deploy:
	git add .
	set /p commit_msg="Enter commit message: "
	git commit -m "$$commit_msg"
	git push origin main

build:
	git pull origin main
	docker image rm varenyam/jiva:react-app
	docker build --no-cache -t varenyam/jiva:react-app .
	docker image push varenyam/jiva:react-app