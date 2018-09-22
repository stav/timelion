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

## Jasmine

``` bash
$ node node_modules/jasmine/bin/jasmine -v

jasmine v3.2.0
jasmine-core v3.2.1
```

``` bash
$ node node_modules/jasmine/bin/jasmine help

Usage: jasmine [command] [options] [files]

Commands:
      init  initialize jasmine
  examples  install examples
   help,-h  show help
version,-v  show jasmine and jasmine-core versions

If no command is given, jasmine specs will be run


Options:
        --no-color  turn off color in spec output
           --color  force turn on color in spec output
         --filter=  filter specs to run only those that match the given string
         --helper=  load helper files that match the given string
        --require=  load module that match the given string
--stop-on-failure=  [true|false] stop spec execution on expectation failure
      --fail-fast=  [true|false] stop Jasmine execution on spec failure
         --config=  path to your optional jasmine.json
       --reporter=  path to reporter to use instead of the default Jasmine reporter

The given arguments take precedence over options in your jasmine.json
The path to your optional jasmine.json can also be configured by setting the JASMINE_CONFIG_PATH environment variable
```
