<template>
  <v-app id="inspire" dark>


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

    <v-toolbar dark app fixed color="blue darken-3"
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
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="https://cdn.vuetifyjs.com/images/logos/logo.svg"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>

      <router-view></router-view>

    </v-content>
    <v-btn
      fab
      bottom
      right
      color="pink"
      dark
      fixed
      @click="dialog = !dialog"
      >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          Create contact
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="40px" class="mr-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  placeholder="Name"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="business"
                placeholder="Company"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                placeholder="Job title"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
                mask="phone"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                placeholder="Notes"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
