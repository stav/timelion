README

This is my timeline, timelion.

Credits:

	The UI so far is based on Lim Chee Aun's `life`
	https://github.com/cheeaun/life chosen for its simplicity.

	Boilerplate code with MIT license from https://html5boilerplate.com/

	Promise polyfill with MIT license from https://github.com/stefanpenner/es6-promise

	Modernizr with MIT & BSD licenses from https://modernizr.com/

	normalize.css with MIT license from github.com/necolas/normalize.css

	Tests courtesy of Jasmine with MIT license from http://jasmine.github.io/

Start a web-server with something like:

	timelion$ python -m http.server 8000
	Serving HTTP on 0.0.0.0 port 8000 ...

Run tests:

	http://localhost:8000/tests/SpecRunner.html

Run app:

	http://localhost:8000/app/index.html

Note:

	Search is only available currently without browser security enabled,
	no CORS support, start browser like:

		chromium-browser --disable-web-security --user-data-dir &

	Months in events data

		one-based [1,2,3,4,5,6,7,8,9,10,11,12]

			1 is January
			2 is February
			3 is March...
			12 is December

		cannot be prefixed by a leading zero

			January is "1" not "01"
