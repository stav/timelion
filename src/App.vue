<template>
  <v-app id="inspire" dark>

    <!-- Navigation -->

    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
      >
      <v-list dense>
        <template v-for="item in items">

          <!-- Heading -->
          <v-layout
            v-if="item.heading"
            :key="item.heading"
            row
            align-center
            >
            <v-flex xs12>
              <v-subheader>
                {{ item.heading }}
              </v-subheader>
            </v-flex>
          </v-layout>

          <!-- Group -->
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
            >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title class="list-group">
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!-- Children -->
            <router-link v-for="(child, i) in item.children" :key="i"
              :to="{ name: 'timeline', params: { tid: child.id }}"
              class="router-link"
              >
              <v-list-tile>
                <v-list-tile-action v-if="child.icon">
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ child.name }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
          </v-list-group>

          <!-- Other -->
          <v-list-tile v-else :key="item.text" @click="">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->

    <v-toolbar app fixed color="blue darken-3"
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <router-link to="/" title="Home">
          <v-icon>linear_scale</v-icon>
          <span class="home hidden-xs-and-down">TmL1on</span>
        </router-link>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon large
        href="https://vuetifyjs.com/en/getting-started/quick-start"
        target="_blank"
        >
        <v-avatar size="32px" tile>
          <img
            src="https://cdn.vuetifyjs.com/images/logos/logo.svg"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>

    <!-- Content -->

    <v-content>
      <router-view></router-view>
    </v-content>

    <!-- Bottom -->

    <v-bottom-sheet inset persistent hide-overlay :value="inspect">
      <v-card tile>
        <v-progress-linear class="my-0" height="3" :value="100"></v-progress-linear>
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title v-text="eventTitle"></v-list-tile-title>
              <v-list-tile-sub-title v-text="eventDate"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-bottom-sheet>

  </v-app>
</template>

<script>
  import * as timelines from '/home/stav/Work/stav/Timelion/timelines'

  export default {

    data: () => ({
      timelines,
      dialog: false,
      drawer: null,
      items: [
        {
          model: true,
          text: 'Timelines',
          icon: 'keyboard_arrow_up', 'icon-alt': 'keyboard_arrow_down',
          children: timelines.list,
        },
        { heading: 'Meta' },
        { icon: 'settings', text: 'Settings' },
        { icon: 'help', text: 'Help' },
      ]
    }),

    computed: {
      edata () {
        return this.timelines[ this.$route.params.tid ]
      },
      eventTitle () {
        return this.inspect ? this.$store.state.cevent.title : ''
      },
      inspect () {
        return Boolean(this.$store.state.cevent)
      },
      eventDate () {
        const cevent = this.$store.state.cevent;
        const eindex  = cevent ? cevent.dataset.index : undefined;
        return eindex === undefined ? 'nope' : this.edata.events[ eindex ].date
      },
    },

  }
</script>

<style scoped="true">
  a {
    color: white;
    text-decoration: none;
  }
  .list-group {
    color: darkgrey;
    font-size: larger;
    text-decoration: none;
  }
</style>
