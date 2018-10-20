# README

## Install nvm

https://github.com/creationix/nvm/blob/master/README.md#installation

$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

$ nvm --version

	0.33.11

## Update Node

$ nvm install v10.12.0

	Downloading and installing node v10.12.0...
	Downloading https://nodejs.org/dist/v10.12.0/node-v10.12.0-linux-x64.tar.xz...
	###################################################################################################################################################################################################################################################### 100.0%
	Computing checksum with sha256sum
	Checksums matched!
	Now using node v10.12.0 (npm v6.4.1)
	Creating default alias: default -> v10.12.0

$ node --version

	v10.12.0

## Update npm

$ npm install npm@latest -g

	/home/stav/.nvm/versions/node/v10.12.0/bin/npm -> /home/stav/.nvm/versions/node/v10.12.0/lib/node_modules/npm/bin/npm-cli.js
	/home/stav/.nvm/versions/node/v10.12.0/bin/npx -> /home/stav/.nvm/versions/node/v10.12.0/lib/node_modules/npm/bin/npx-cli.js
	+ npm@6.4.1
	updated 1 package in 4.512s

$ npm --version

	6.4.1

## Install Vuejs CLI

$ npm install @vue/cli@latest -g

	/home/stav/.nvm/versions/node/v10.12.0/bin/vue -> /home/stav/.nvm/versions/node/v10.12.0/lib/node_modules/@vue/cli/bin/vue.js
	+ @vue/cli@3.0.5
	added 631 packages from 446 contributors in 23.671s

## Create Application

$ vue create timeview

	Vue CLI v3.0.5
	✨  Creating project in /home/stav/Work/stav/Timelion/timeview.
	🗃  Initializing git repository...
	⚙  Installing CLI plugins. This might take a while...
	> yorkie@2.0.0 install /home/stav/Work/stav/Timelion/timeview/node_modules/yorkie
	> node bin/install.js
	setting up Git hooks
	added 1273 packages from 742 contributors and audited 14138 packages in 19.979s
	found 0 vulnerabilities
	🚀  Invoking generators...
	📦  Installing additional dependencies...
	added 5 packages from 1 contributor and audited 14144 packages in 7.866s
	found 0 vulnerabilities
	⚓  Running completion hooks...
	📄  Generating README.md...
	🎉  Successfully created project timeview.
	👉  Get started with the following commands:
	  $ cd timeview
	  $ npm run serve

## Add Vurtify

$ vue add vuetify

	📦  Installing vue-cli-plugin-vuetify...
	+ vue-cli-plugin-vuetify@0.3.0
	added 1 package from 1 contributor and audited 14145 packages in 8.583s
	found 0 vulnerabilities
	✔  Successfully installed plugin: vue-cli-plugin-vuetify
	? preset: default (recommended)
	🚀  Invoking generator for vue-cli-plugin-vuetify...
	📦  Installing additional dependencies...
	added 16 packages from 53 contributors and audited 14195 packages in 9.261s
	found 0 vulnerabilities
	⚓  Running completion hooks...
	✔  Successfully invoked generator for plugin: vue-cli-plugin-vuetify
	   The following files have been updated / added:
	     src/assets/logo.svg
	     src/plugins/vuetify.js
	     .browserslistrc
	     babel.config.js
	     package-lock.json
	     package.json
	     public/index.html
	     src/App.vue
	     src/components/HelloWorld.vue
	     src/main.js
	     src/views/Home.vue


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
