<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated> -->
    <q-header>
      <q-toolbar class="bg-white text-black">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title >
          <strong> {{ title }} </strong>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>菜单选项</q-item-label>
        <q-item clickable v-ripple to="/sendMoac"
          :active="link === 'sendMoac'"
          @click="link = 'sendMoac'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-avatar size="32px"><img src="statics/icons/moac-logo1.jpg" /></q-avatar>
          </q-item-section>
          <q-item-section>批量转账墨客</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/sendErc20"
          :active="link === 'sendErc20'"
          @click="link = 'sendErc20'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar>
          </q-item-section>
          <q-item-section>批量转账ERC20</q-item-section>
        </q-item>

        <q-item clickable tag="a" target="_blank" href="http://47.92.110.121/batchTransfer/转账模板表.xlsx">
          <q-item-section avatar>
            <q-icon color="green" size="32px" name="cloud_download" />
          </q-item-section>
          <q-item-section>EXCEL模板下载</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/batchTransferHelp"
          :active="link === 'batchTransferHelp'"
          @click="link = 'batchTransferHelp'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="blue" size="32px" name="help" />
          </q-item-section>
          <q-item-section>帮 助</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: false,
      link: 'sendMoac',
      title: '批量转账墨客'
    }
  },
  methods: {
    selectMenu () {
      if (this.link === 'sendMoac') {
        this.title = '批量转账墨客'
      } else if (this.link === 'sendErc20') {
        this.title = '批量转账ERC20'
      } else if (this.link === 'batchTransferHelp') {
        this.title = '帮 助'
      }
    }
  }
}
</script>

<style lang="stylus">
.my-menu-link
  color white
  background-color #027BE3
  font-weight bold
</style>
