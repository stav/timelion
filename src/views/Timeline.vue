<template>
  <section>
<!--
    <p>({{ tid }})</p>
    <p>({{ timelion.loaded }})</p>
    <p>({{ timelion }})</p>
 -->
  	<div id="timelion-years" ref="timelionYears">
      <div class="year"
        v-for="year in years"
        :ref="`year_${year}`"
        :data-year="year"
        v-text="year"
      ></div>
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
        const $timelionYears = this.$refs.timelionYears;
        $timelionYears.innerHTML = '';

        this.timelion.reset()
        this.timelion.load( this.edata )

        const size = this.timelion.final_year - this.timelion.first_year;
        const years = [...Array(size).keys()].map(i => i + this.timelion.first_year);
        this.years.push(...years)

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

</style>
