<template>
  <section id="timelion">

    <div id="timelion-years" ref="timelionYears">
      <div class="year"
        v-for="year in years"
        :data-year="year"
        :style="year_style(year)"
      ><span v-text="year"></span></div>
    </div>

    <div id="timelion-events" ref="timelionEvents">
      <div class="event"
        v-for="(event, i) in events"
        :data-index="i"
        :title="event.title"
        :tabindex="i+1"
        :style="`marginLeft: ${event.offset.toFixed(2)}px`"
        @click.capture.stop="inspect"
        >
        <div class="line"
          :style="`width: ${event.width.toFixed(2)}px`"
        ></div>
        <span class="mark"
          v-text="event.title"
          :style="`left: -${event.width.toFixed(2)}px`"
        ></span>
      </div>
    </div>

	</section>
</template>

<script>
  import utils from '@/components/utils';
  import Timelion from '@/components/Timelion'
  // import Timeline from '@/components/Timeline'
  import * as timelines from '/home/stav/Work/stav/Timelion/timelines'

  export default {

    props: {
      tid: String
    },
    // props: ['tid'],

    data: () => ({
      timelines,
      timelion: new Timelion(),
      years: [],
      events: [],
      cevent: null,
    }),

    computed: {
      edata () {
        return this.timelines[ this.tid ]
      },
    },

    methods: {
      /**
       * Clear the old data and load in the new
       */
      render ()
      {
        this.timelion.reset()
        this.timelion.load( this.edata )
        this.events = this.timelion.events;
        const size = this.timelion.final_year - this.timelion.first_year;
        this.years = [...Array(size).keys()].map(i => i + this.timelion.first_year);
      },
      /**
       * Handle keyboard events
       */
      handleKeypress ( kevent )
      {
        if (kevent.key === '1') {
            this.zoom( -1 )  // zoom out
        }
        else if (kevent.key === '2') {
            this.zoom( 1 )  // zoom in
        }
      },
      /**
       * Zoom in or out based on the positive or negative factor
       */
      zoom ( factor )
      {
        this.timelion.year_width += factor;
        // TODO duplicattion below
        this.timelion.setup_events()
        for ( const event of this.events )
        {
          event.set_offset( this.timelion );
          event.set_width( this.timelion );
        }
      },
      /**
       * Determine the style for the year
       */
      year_style ( year ) {
        return {
          opacity: this.year_opacity(year),
          width: `${this.timelion.year_width.toFixed(2)}px`,
        }
      },
      /**
       * Determine if we should be displaying the given year's text & divider
       */
      year_opacity ( year ) {
        if ( this.timelion.year_width > 40 )
          return 1;

        if ( this.timelion.year_width > 20 )
        {
          if ( year % 2 === 0 )
            return 1;
          else
            return 0;
        }
        else
        {
          if ( year === this.timelion.first_year )
            return 1;
          if ( year % 10 === 0 )
            return 1;

          if ( this.timelion.year_width > 10 )
          {
            if ( year % 5 === 0 )
              return 0.5;
          }
        }

        return 0;
      },

      inspect: function ( e ) {
        const isEventElement = Object.values(e.target.classList).includes('event');
        this.cevent = isEventElement ? e.target : e.target.parentElement;
        this.$store.commit( 'setEvent', this.cevent )
      },

    },

    // components: {
    //   Timeline,
    // },

    mounted () {
      // this.$nextTick(function () {})
      this.render()
      window.addEventListener( 'keypress', this.handleKeypress )
    },

    watch: {
      $route ( to, from ) {
        this.render()
      }
    },

  }
</script>

<style>

  #timelion{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  #timelion-years{
    position: absolute;
    top: 0;
    bottom: 0;
    white-space: nowrap;
    pointer-events: none;
  }
  #timelion-years .year{
    display: inline-block;
    box-sizing: border-box;
    color: #fff;
    font-weight: 300;
    white-space: nowrap;
    box-sizing: border-box;
    width: 55px; height: 100%;
    border-left: 1px dashed rgba(255,255,255,.2);
  }
  #timelion-years .year:first-child{
    border-left: 0;
  }
  #timelion-years .year span{
    background: linear-gradient(to bottom, rgba(56,64,71,1) 30%,rgba(56,64,71,0) 100%);
    display: block;
    padding: 10px;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 3;
  }
  #timelion-years .year span i{
    opacity: .5;
    font-style: normal;
  }

  #timelion-events{
    padding-top: 40px;
    padding-bottom: 5em;
    position: relative;
  }
  #timelion-events:after{
    content: '';
    display: block;
    clear: left;
  }
  #timelion .event{
    padding-right: 20px;
    padding-bottom: 5px;
    vertical-align: middle;
    white-space: nowrap;
    float: left;
    clear: left;
  }
  #timelion .event i{
    color: rgba(255,255,255,.5);
    margin-right: 3px;
    padding-right: 7px;
  }
  #timelion .event .line{
    display: inline-block;
    overflow: hidden;
    height: 0;
    border: 4px solid #fff;
    border-radius: 4px;
    opacity: .3;
    position: relative;
  }
  #timelion .event:hover .line{
    opacity: .5;
  }
  #timelion .event:focus .line{
    opacity: 1;
  }
  #timelion .event:focus .mark{
    top: -9px;
  }
  #timelion .event .mark{
    border-bottom: #777 solid 1px;
    position: relative;
    top: -8px;
  }

</style>
