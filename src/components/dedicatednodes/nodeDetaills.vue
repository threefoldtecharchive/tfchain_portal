<template>
  <v-row>
    <v-col :cols="4">
      <v-card flat color="transparent" tag="div">
        <!-- Title -->
        <v-list-item>
          <v-list-item-icon>
            <v-icon size="30" class="mr-2">mdi-harddisk</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="font-size: 20px">
              Node Resources
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Details -->
        <v-row>
          <v-col cols="12">
            <v-list color="transparent">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> CPU Resource Unit </v-list-item-title>
                </v-list-item-content>
                {{ node.resources.cru }} CPU
              </v-list-item>
              <v-divider />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Disk Resource Unit (HDD)
                  </v-list-item-title>
                </v-list-item-content>
                {{ byteToGB(node.resources.hru) }} GB
              </v-list-item>
              <v-divider />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Disk Resource Unit (SSD)
                  </v-list-item-title>
                </v-list-item-content>
                {{ byteToGB(node.resources.sru) }} GB
              </v-list-item>
              <v-divider />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> Memory Resource Unit </v-list-item-title>
                </v-list-item-content>
                {{ byteToGB(node.resources.mru) }} GB
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-col :cols="4">
      <v-card flat color="transparent" tag="div">
        <!-- Title -->
        <v-list-item>
          <v-list-item-icon>
            <v-icon size="30" class="mr-2">mdi-map-marker</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="font-size: 20px">
              Location
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Details -->
        <v-row>
          <v-col cols="12">
            <v-list color="transparent">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> Country </v-list-item-title>
                </v-list-item-content>
                {{ node.location.country }}
              </v-list-item>
              <v-divider />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> City </v-list-item-title>
                </v-list-item-content>
                {{ node.location.city }}
              </v-list-item>
              <v-divider />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> Longitude </v-list-item-title>
                </v-list-item-content>
                {{ node.location.long }}
              </v-list-item>
              <v-divider />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> Latitude </v-list-item-title>
                </v-list-item-content>
                {{ node.location.lat }}
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col :cols="4">
      <v-card flat color="transparent" tag="div">
        <!-- Title -->
        <v-list-item>
          <v-list-item-icon>
            <v-icon size="30" class="mr-2">mdi-earth</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="font-size: 20px">
              Public IPs
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Details -->
        <v-row>
          <v-col cols="12">
            <v-list color="transparent">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> Farm Public Ips </v-list-item-title>
                </v-list-item-content>
                {{ node.pubIps }}
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { byteToGB } from '../../lib/dedicatedNodes'

export default {
  name: "NodeDetails",
  props: ["node"],

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    byteToGB(capacity) {
      return byteToGB(capacity);
    }
  },
};
</script>

<style>
.v-list {
  color: #252c48;
}
</style>