# Timelion

*This is my timeline, timelion.*

## Environment

### Setup Python

``` bash
timetigr $ pipenv install --three

Creating a virtualenv for this project...
Pipfile: /home/stav/Work/stav/Timelion/timetigr/Pipfile
Using /usr/bin/python3 (3.6.3) to create virtualenv...
⠋Running virtualenv with interpreter /usr/bin/python3
Using base prefix '/usr'
New python executable in /home/stav/.virtualenvs/timetigr-gcLPL2t4/bin/python3
Also creating executable in /home/stav/.virtualenvs/timetigr-gcLPL2t4/bin/python
Installing setuptools, pip, wheel...done.
Setting project for timetigr-gcLPL2t4 to /home/stav/Work/stav/Timelion/timetigr
Virtualenv location: /home/stav/.virtualenvs/timetigr-gcLPL2t4
Creating a Pipfile for this project...
Pipfile.lock not found, creating...
Locking [dev-packages] dependencies...
Locking [packages] dependencies...
Updated Pipfile.lock (ca72e7)!
Installing dependencies from Pipfile.lock (ca72e7)...
  🐍   ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ 0/0 — 00:00:00
To activate this project's virtualenv, run pipenv shell.
Alternatively, run a command inside the virtualenv with pipenv run.

timetigr $ pipenv shell

Launching subshell in virtual environment…
 . /home/stav/.virtualenvs/timetigr-gcLPL2t4/bin/activate
```

## Installation

### Install *Node*

``` bash
timetigr-gcLPL2t4 | timetigr $ pipenv install nodeenv

Installing nodeenv...
Collecting nodeenv
Installing collected packages: nodeenv
Successfully installed nodeenv-1.3.2
Adding nodeenv to Pipfile's [packages]...
Pipfile.lock (ca72e7) out of date, updating to (2662ea)...
Locking [dev-packages] dependencies...
Locking [packages] dependencies...
Updated Pipfile.lock (2662ea)!
Installing dependencies from Pipfile.lock (2662ea)...
  🐍   ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ 1/1 — 00:00:00
 timetigr-gcLPL2t4 | timetigr $ which nodeenv
/home/stav/.virtualenvs/timetigr-gcLPL2t4/bin/nodeenv

timetigr-gcLPL2t4 | timetigr $ nodeenv --version

1.3.2

timetigr-gcLPL2t4 | timetigr $ exit
exit

timetigr $ pipenv shell

Launching subshell in virtual environment…
 . /home/stav/.virtualenvs/timetigr-gcLPL2t4/bin/activate
 timetigr $  . /home/stav/.virtualenvs/timetigr-gcLPL2t4/bin/activate
 timetigr-gcLPL2t4 | timetigr $ nodeenv -p --prebuilt
 * Install prebuilt node (10.11.0) ..... done.
 * Appending data to /home/stav/.virtualenvs/timetigr-gcLPL2t4/bin/activate
 * Appending data to /home/stav/.virtualenvs/timetigr-gcLPL2t4/bin/activate.fish

timetigr-gcLPL2t4 | timetigr $ npm -v

6.4.1

timetigr-gcLPL2t4 | timetigr $ node -v

v10.11.0
```

## Development

### Start the dev server

``` bash
npm run start
```

### Run tests

``` bash
npm test
```

## Deployment

``` bash
npm run build
make deploy
```

## Components

### Jest

``` bash
$ npm test -- -v

> timelion@0.1.0 test /home/stav/Work/stav/Timelion/timetigr/timetony
> jest "-v"

23.6.0
```

#### Debug

``` bash
timetigr/timetony$ node --inspect-brk node_modules/.bin/jest --runInBand
```

or

``` bash
timetigr/timetony$ node --inspect-brk /home/stav/Work/stav/Timelion/timetigr/timetony/node_modules/webpack-dev-server/bin/webpack-dev-server --open --progress --config webpack.dev.js --runInBand
```

Then go to Chrome to attach to session: chrome://inspect/#devices

```
Remote Target #LOCALHOST Target (v10.11.0)
/home/stav/Work/stav/Timelion/timetigr/timetony/node_modules/webpack-dev-server/bin/webpack-dev-serv…
```

Click on `inspect` and then Resume (F8) to get by the initial setu pbreakpoint

### V8

``` bash
$ node -p process.versions.v8

6.8.275.32-node.28
```
