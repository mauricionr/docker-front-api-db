## Docker Nodejs ReactJS PostgreSQL

### Setup your enviroment

make sure you have **docker**, **docker compose**, **git**, **nodejs** installed

### Setup 

#### Pre production

`git clone https://github.com/mauricionr/docker-front-api-db.git app`

`cd app/`

`docker-compose up --build -d`

go to `http://localhost:5001` to see the application running

go to `http://localhost:5000` to see the API status

#### Local dev

##### API

`cd api/`

`npm run dev`

API shuld be running on port 3000

or

if you are using **vscode** just hit `f5` to start the api and debug with breakpoints

##### WEB

`cd web/`

`npm run dev`

WEB should be running on port 3001


##### db

`docker-compose up db`

##### TODO

AWS
