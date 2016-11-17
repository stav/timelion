# README

This is my timeline, timelion.

## Credits:

The UI so far is based on Lim Chee Aun's `life`
https://github.com/cheeaun/life chosen for its simplicity.

Boilerplate code with MIT license from https://html5boilerplate.com/

Promise polyfill with MIT license from https://github.com/stefanpenner/es6-promise

Modernizr with MIT & BSD licenses from https://modernizr.com/

normalize.css with MIT license from github.com/necolas/normalize.css

Tests courtesy of Jasmine with MIT license from http://jasmine.github.io/

## Usage

Data is currently harcoded to use only `example.json`.

### Start a web-server with something like:

	timelion$ python -m http.server 8000
	Serving HTTP on 0.0.0.0 port 8000 ...

### Run tests:

	http://localhost:8000/tests/SpecRunner.html

### Run app:

	http://localhost:8000/app/index.html

## Note:

Search is only available currently without browser security enabled,
no CORS support, start browser like:

	chromium-browser --disable-web-security --user-data-dir &

### Months in events data

#### one-based [1,2,3,4,5,6,7,8,9,10,11,12]

	1 is January
	2 is February
	3 is March...
	12 is December

#### cannot be prefixed by a leading zero

	January is "1" not "01"

## Example:

Turn this:

	{
	  "events": [
		{"date": [[1950]], "title": "1950"},
		{"date": [[1960,1]], "title": "Jan 1960"},
		{"date": [["February 3, 1969"]], "title": "3 Feb 1969"},
		{"date": [[1970], [1980]], "title": "1970 & 1980", "id": "target1"},
		{"date": [[2016], [2018]], "title": "2016 - 2018", "id": "target2"},
		{"search": "Donald Trump"},
		{"search": "Hillary Clinton"},
		{}
	  ]
	}

into this:

	<section id="timelion">
		<div id="timelion-years">
			<div class="year" style="width: 18.25px;"><span>1946</span></div>
			<div class="year" style="width: 18.25px;"><span>1947</span></div>
			<div class="year" style="width: 18.3px;" ><span>1948</span></div>
			...
			<div class="year" style="width: 18.25px;"><span>2019</span></div>
		</div>
		<div id="timelion-events">
			<div title="1950" class="event" style="margin-left: 73.05px;">
			<div class="line" style="width: 1221.35px;"></div><b>1950</b>1950</div>
			<div title="Jan 1960" class="event" style="margin-left: 255.65px;">
				<div class="line" style="width: 1038.75px;"></div>
				<b>1960,1</b>Jan 1960
			</div>
			...
			<div title="Hillary Clinton" class="event" style="margin-left: 33.15px;">
				<div class="line" style="width: 1261.25px;"></div>
				<b>1947,10,26,</b>Hillary Clinton
			</div>
		</div>
	</section>

which will look like:

[![Timelion screenshot](http://104.237.140.142/timelion/assets/screenshot.png)](http://104.237.140.142/timelion/assets/screenshot.png)

