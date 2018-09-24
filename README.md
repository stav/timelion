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

## Components

### Jest

``` bash
$ npm test -- -v

> timelion@0.1.0 test /home/stav/Work/stav/Timelion/timetigr/timelion
> jest "-v"

23.6.0
```

#### Debug

``` bash
timetigr/timelion$ node --inspect-brk node_modules/.bin/jest --runInBand
```

Then go to Chrome to attach to session

### V8

``` bash
$ node -p process.versions.v8

6.8.275.32-node.28
```
