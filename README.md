Pre-requisites
---------------

- MongoDB setup on local
- node installed on local.

How to run
----------

- You will see two folders named `amtica-BE` (For backend) and `amtica-FE` (For frontend)
- Go to `amtica-BE` folder and run `node app` through terminal.
- This will start the node server on `localhost:3000`.


Angular Build
-------------

- Angular build is hosted via nodejs server
- Node.js server is running on `localhost:3000`
- So in order to open the website go to url `localhost:3000` or any other appropriate route
    - currently supported routes:
        - /login
        - /signup


Angular Source code
-------------------

- In order to run and test the source code.
- Go to amtica-FE folder and run `npm start` from terminal. This runs the angular on `localhost:4200`
- Note: `npm start` already contains the setting to proxy the `localhost:4200` to `localhost:3000`, so that api's run correctly.
- Do not do `ng serve` as this will lead errors in apiendpoints. If you wish to run `ng serve`, do execute it using like this with proxy-config flag `ng-server --proxy-config proxy.conf.json`.