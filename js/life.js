(function(){
	var life = {
		$title: document.getElementById('title'),
		$el: document.getElementById('life'),
		utils: {
			extend: function(object){
				var args = Array.prototype.slice.call(arguments, 1);
				for (var i=0, source; source=args[i]; i++){
					if (!source) continue;
					for (var property in source){
						object[property] = source[property];
					}
				}
				return object;
			}
		},
		config: {
			yearLength: 120, // 120px per year
			hideAge: false, // Hide age from year axis
			customStylesheetURL: null // Custom stylesheet
		},
		start: function(){
			life.loadConfig(function(config){
				life.config = life.utils.extend(life.config, config);
				if (life.config.customStylesheetURL) life.injectStylesheet(life.config.customStylesheetURL);

				life.fetch(function(response){
					var data = life.parse(response);
					var title = life.parseTitle(response);
					life.render(title, data);
				});
			});
		},
		loadConfig: function(fn){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'config.json', true);
			xhr.onload = function(){
				if (xhr.status == 200){
					fn(JSON.parse(xhr.responseText));
				} else {
					fn({});
				}
			};
			xhr.onerror = xhr.onabort = function(){
				fn({});
			};
			xhr.send();
		},
		injectStylesheet: function(url){
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = url;
			document.body.appendChild(link);
		},
		fetch: function(fn){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'life.md', true);
			xhr.onload = function(){
				if (xhr.status == 200) fn(xhr.responseText);
			};
			xhr.send();
		},
		parse: function(response){
			var list = response.match(/\-\s+[^\n\r]+/ig);
			var data = [];
			list.forEach(function(l){
				var matches = l.match(/\-\s+([\d\/\-\~]+)\s(.*)/i);
				var time = matches[1];
				var text = matches[2];
				data.push({
					time: life.parseTime(time),
					text: text
				});
			});
			return data;
		},
		parseTitle: function(response){
			return response.match(/[^\r\n]+/i)[0];
		},
		parseTime: function(time, point){
			if (!point) point = 'start';
			var data = {};
			if (/^\~\d+$/.test(time)){ // ~YYYY
				data = {
					startYear: parseInt(time.slice(1), 10),
					estimate: true
				};
			} else if (/^\d+$/.test(time)){ // YYYY
				data[point + 'Year'] = parseInt(time, 10);
			} else if (/^\d+\/\d+$/.test(time)){ // MM/YYYY
				var t = time.split('/');
				data[point + 'Month'] = parseInt(t[0], 10);
				data[point + 'Year'] = parseInt(t[1], 10);
			} else if (/^\d+\/\d+\/\d+$/.test(time)){ // DD/MM/YYYY
				var t = time.split('/');
				data[point + 'Date'] = parseInt(t[0], 10);
				data[point + 'Month'] = parseInt(t[1], 10);
				data[point + 'Year'] = parseInt(t[2], 10);
			} else if (/\d\-/.test(time)){ // TIME-TIME
				var splitTime = time.split('-');
				var startTime = life.parseTime(splitTime[0]);
				var endTime = life.parseTime(splitTime[1], 'end');
				for (var k in startTime) { data[k] = startTime[k] }
				for (var k in endTime) { data[k] = endTime[k] }
			} else if (time == '~'){ // NOW
				var now = new Date();
				data.endYear = now.getFullYear();
				data.endMonth = now.getMonth()+1;
				data.endDate = now.getDate();
			}
			data.title = time;
			return data;
		},
		firstYear: null,
		renderEvent: function(d){
			var firstYear = life.firstYear;
			var yearLength = life.config.yearLength;
			var monthLength = yearLength/12;
			var dayLength = monthLength/30;

			var time = d.time;
			var estimate = time.estimate;
			var startYear = time.startYear;
			var startMonth = time.startMonth;
			var startDate = time.startDate;
			var endYear = time.endYear;
			var endMonth = time.endMonth;
			var endDate = time.endDate;
			var width = 0;

			// Calculate offset
			var startTime = new Date(firstYear, 0, 1);
			var endTime = new Date(startYear, startMonth ? startMonth-1 : 0, startDate || 1);
			var daysDiff = (endTime - startTime)/(24*60*60*1000);
			offset = daysDiff*dayLength;

			// Calculate width
			if (endYear){
				var _endMonth = endMonth ? endMonth-1 : 11;
				var _endDate = endDate || new Date(endYear, _endMonth+1, 0).getDate();
				startTime = new Date(startYear, startMonth ? startMonth-1 : 0, startDate || 1);
				endTime = new Date(endYear, _endMonth, _endDate);
				daysDiff = (endTime - startTime)/(24*60*60*1000);
				width = daysDiff*dayLength;
			} else {
				if (startDate){
					width = dayLength;
				} else if (startMonth){
					width = monthLength;
				} else {
					width = yearLength;
				}
			}

			// Parse Markdown links in the text
			// credit: http://stackoverflow.com/a/9268827
			var link = null;
			while(link = d.text.match(/\[([^\]]+)\]\(([^)"]+)(?: \"([^\"]+)\")?\)/)) {
				var link_attr = "";
				if (link[3] !== undefined) {
					link_attr = " title='" + link[3] + "'";
				}
				d.text = d.text.replace(link[0], "<a href='" + link[2] + "'" + link_attr + ">" + link[1] + "</a>");
			}

			return '<div class="event" style="margin-left: ' + offset.toFixed(2) + 'px">'
				+ '<div class="time" style="width: ' + width.toFixed(2) + 'px"></div>'
				+ '<b>' + d.time.title + '</b> ' + d.text
				+ '</div>';
		},
		renderYears: function(firstYear, lastYear){
			var dayLength = life.config.yearLength/12/30;
			var html = '';
			var days = 0;
			var hideAge = life.config.hideAge;
			for (var y=firstYear, age = 0; y<=lastYear+1; y++, age++){
				var days = (y % 4 == 0) ? 366 : 365;
				html += '<div class="year" style="width: ' + (days*dayLength).toFixed(2) + 'px"><span>'
					+ y + (hideAge ? '' : (' <i>(' + age + ')</i>'))
					+ '</span></div>';
			}
			return html;
		},
		render: function(title, data){
			document.title = title;
			life.$title.innerHTML = title;

			// Get the first and last year for the year axis
			var firstYear = new Date().getFullYear();
			var lastYear = firstYear;
			data.forEach(function(d){
				var time = d.time;
				var startYear = time.startYear;
				var endYear = time.endYear;
				if (startYear && startYear < firstYear) firstYear = startYear;
				if (endYear && endYear > lastYear) lastYear = endYear;
			});
			life.firstYear = firstYear;

			var html = '<div id="life-events">';
			// 'comment_' class name is to hide it from Safari Reader
			html += '<div id="life-years" class="comment_">' + life.renderYears(firstYear, lastYear) + '</div>';
			data.forEach(function(d){
				html += life.renderEvent(d);
			});
			html += '</div>';
			life.$el.innerHTML = html;
		}
	};

	var slider = {
		startingMousePostition: {},
		containerOffset: {},
		init: function(){
			window.addEventListener('mousedown', function(event){
				slider.startingMousePostition = {
					x: event.clientX,
					y: event.clientY
				};
				slider.containerOffset = {
					x: life.$el.scrollLeft,
					y: life.$el.scrollTop
				};
				window.addEventListener('mousemove', slider.slide);
			});
			window.addEventListener('mouseup', function(event){
				window.removeEventListener('mousemove', slider.slide);
			});
		},
		slide: function(event){
			event.preventDefault();
			var x = slider.containerOffset.x + (slider.startingMousePostition.x - event.clientX);
			var y = slider.containerOffset.y + (slider.startingMousePostition.y - event.clientY);
			life.$el.scrollLeft = x;
			life.$el.scrollTop = y;
		}
	};

	life.start();
	slider.init();
})();
