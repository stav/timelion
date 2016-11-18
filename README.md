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


### Start a web-server with something like:

	timelion$ python -m http.server 8000
	Serving HTTP on 0.0.0.0 port 8000 ...

### Run tests:

	http://localhost:8000/tests/SpecRunner.html

### Run app:

	http://localhost:8000/app/index.html

## Notes on Data:

Data acquisition is currently hard-coded to use only `example.json`.

### Search

Search is only available currently without browser security enabled which will
prevent cross domain requests (no CORS support), start browser like:

	chromium-browser --disable-web-security --user-data-dir &

### Fields

#### `date`

Determines starting and ending positions for the event on the timeline

Format:

* YEAR, MONTH, DAY are all integers.
* DATE is a string.

	Array( Array( YEAR [, MONTH [, DAY ] ] ) [, Array( YEAR [, MONTH [, DAY ] ] ) ] )

	Array( Array( DATE )[, Array( DATE )] )

Examples:

	[[1950]]
	[[ 1950, 1 ]]
	[[1950,1,27]]
	[ [ 1933 ], [ 1945 ] ]
	[[ 1942, 12, 21 ],[ 1960, 5, 1 ]]
	[["February 3, 1969"]]
	[["1969-02-03"]]

#### `title`

Display text for the event

Format:

	String()

Examples:

	"Birth of a nation"
	"Grad school"
	"Wedding"

#### `search`

Goes to Wikipedia and searches for text, best when you use a person

Format:

	String()

Examples:

	"Nicolaus Copernicus"
	"Frederic Chopin"
	"Donald Trump"

#### `id`

HTML identifier used on event container

Format:

	String()

Examples:

	"nicolaus-copernicus"
	"frederic-chopin"
	"donald-trump"

### Months

#### one-based [1,2,3,4,5,6,7,8,9,10,11,12]

	1 is January
	2 is February
	3 is March...
	12 is December

#### cannot be prefixed by a leading zero

	January is 1 not 01

## Zoom

You can redraw the timeline with more (`2`) or less (`1`) space between years
by using the `1` and `2` keys.

## Example:

Turn this:

	{
	  "events": [
		{"date": [[1950]], "title": "1950"},
		{"date": [[1960,1]], "title": "Jan 1960"},
		{"date": [["February 3, 1969"]], "title": "3 Feb 1969"},
		{"date": [[1970], [1980]], "title": "1970 & 1980"},
		{"date": [[2016], [2018]], "title": "2016 - 2018"},
		{"search": "Donald Trump", "id": "Red-pill"},
		{"search": "Hillary Clinton", "id": "Blue-pill"},
		{}
	  ]
	}

into this:

	<section id="timelion">
		<div id="timelion-years">
			<div class="year" style="width: 18.25px;"><span>1946</span></div>
			<div class="year" style="width: 18.25px;"><span>1947</span></div>
			...
			<div class="year" style="width: 18.25px;"><span>2019</span></div>
		</div>
		<div id="timelion-events">
			<div title="1950" class="event" style="margin-left: 73.05px;">
			<div class="line" style="width: 1221.35px;"></div><b>1950</b>1950</div>
			...
			<div
				id="Blue-pill"
				title="Hillary Clinton"
				style="margin-left: 33.15px;"
				class="event"
			>
				<div class="line" style="width: 1261.25px;"></div>
				<b>1947,10,26,</b>
				Hillary Clinton
			</div>
		</div>
	</section>

which will look like this:

[![Timelion screenshot](http://104.237.140.142/timelion/assets/screenshot.png)](http://104.237.140.142/timelion/assets/screenshot.png)

