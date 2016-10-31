/**
 * Timelion - the heavy lifting
 */
(function( root, factory ) {

    window.addEventListener("load", function(event) {
        root.timelion = factory();
        console.log("LOAD: lib");
    }, {once: true});
}
(this, function() {
    "use strict";

    return {
        $el: document.getElementById('timelion'),

        config: {
            yearLength: 30, // 120px per year
            hideAge: false, // Hide age from year axis
            customStylesheetURL: null // Custom stylesheet
        },

        load: function(filename){

            function render(response){
                const
                    data = timelion.parse(response);

                timelion.render(data);
            }

            var xhr = new XMLHttpRequest();

            xhr.open('GET', filename, true);
            xhr.onload = function(){
                if (xhr.status == 200) render(xhr.responseText);
            };
            xhr.send();
        },

        parse: function(response){
            const
                list = response.match(/\-\s+[^\n\r]+/ig);
            var
                self = this,
                data = [];

            list.forEach(function(l){
                const
                    matches = l.match(/\-\s+([\d\/\-\~]+)\s(.*)/i),
                    time = matches[1],
                    text = matches[2];
                data.push({
                    time: self.parseTime(time),
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

            var
                self = this,
                data = {};

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
                var startTime = self.parseTime(splitTime[0]);
                var endTime = self.parseTime(splitTime[1], 'end');
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
            var yearLength = this.config.yearLength;
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
            var startTime = new Date(this.firstYear, 0, 1);
            var endTime = new Date(startYear, startMonth ? startMonth-1 : 0, startDate || 1);
            var daysDiff = (endTime - startTime)/(24*60*60*1000);
            var offset = daysDiff*dayLength;

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
            const
                dayLength = this.config.yearLength/12/30,
                hideAge = this.config.hideAge;
            var
                html = '';

            for (var y=firstYear, age = 0; y<=lastYear+1; y++, age++){
                const
                    days = (y % 4 == 0) ? 366 : 365,
                    width = (days*dayLength).toFixed(2);

                html += ''
                    + '<div class="year" style="width: '+ width +'px"><span>'
                    + y + (hideAge ? '' : (' <i>(' + age + ')</i>'))
                    + '</span></div>';
            }
            return html;
        },

        render: function(data){
            // Get the first and last year for the year axis
            var
                self = this,
                firstYear = new Date().getFullYear(),
                lastYear = firstYear,
                html;

            data.forEach(function(d){
                const
                    time = d.time,
                    startYear = time.startYear,
                    endYear = time.endYear;

                if (startYear && startYear < firstYear) firstYear = startYear;
                if (endYear && endYear > lastYear) lastYear = endYear;
            });
            this.firstYear = firstYear;

            html = '<div id="timelion-events">';
            // 'comment_' class name is to hide it from Safari Reader
            html += '<div id="timelion-years" class="comment_">' + this.renderYears(firstYear, lastYear) + '</div>';
            data.forEach(function(d){
                html += self.renderEvent(d);
            });
            html += '</div>';
            this.$el.innerHTML = html;
        }
    }
}));
