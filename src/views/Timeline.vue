<template>
  <section id="timelion">
    <div id="timelion-years" ref="timelionYears">
      <div class="year"
        v-for="year in years"
        :ref="`year_${year}`"
        :data-year="year"
        v-text="year"
      ></div>
    </div>
  	<div id="timelion-events" ref="timelionEvents">
      <div class="event"
        v-for="(event, i) in events"
        :ref="`event_${event}`"
        :title="event.title"
        :tabindex="i+1"
        :style="`marginLeft: ${event.offset.toFixed(2)}px`"
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

      // tid,
      timelines,
      timelion: new Timelion(),
      events: [],
      years: [],
      // edata: timelines[ tid ],

    }),

    computed: {
      edata () {
        return this.timelines[ this.tid ]
      },
    },

    methods: {
      render () {

        // Reset data
        this.timelion.reset()
        this.timelion.load( this.edata )
        this.$refs.timelionYears.innerHTML = '';
        this.$refs.timelionEvents.innerHTML = '';

        // Render years
        const size = this.timelion.final_year - this.timelion.first_year;
        const years = [...Array(size).keys()].map(i => i + this.timelion.first_year);
        this.years.push(...years)

        // Render events
        this.events.push(...this.timelion.events)

        console.log( this.tid, years, this.timelion.events.length, this.edata )
      },
    },

    // components: {
    //   Timeline,
    // },

    mounted () {
      // this.$nextTick(function () {})
      // this.timelion.render()
      // document.addEventListener('keypress', domui.keyPress, false)
      this.render()
    },

    watch: {
      $route ( to, from ) {
        // console.log( 'route', from.params.tid, to.params.tid )
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
