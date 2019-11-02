<template>
  <q-page padding>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input class='q-mt-xs q-mb-none' filled v-model="privateKey"
        placeholder="输入66位0x开头的私钥"
        stack-label dense hide-bottom-space
        counter maxlength="66"
        lazy-rules
        :type="isPwd ? 'password' : 'text'"
        :rules="[ val => val.length == 66 || '请输入66位0x开头的私钥.']"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
        <template v-slot:after>
          <q-btn round dense flat icon="search" v-on:click="getWalletInfo()"></q-btn>
        </template>
      </q-input>

      <div class='q-mt-none q-mb-none'>
        <p>钱包：{{address}}，数量：{{String(balance.toString()).replace(/^(-?)(\d+)((\.\d+)?)$/,
          function (s, s1, s2, s3) {return s1 + s2.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') + s3})
        }}</p>
      </div>

    </q-form>

    <q-separator color="orange" spaced />

    <q-form class='q-mt-md' @submit="onSubmit">
      <label>
        <input type="file" id="file" ref="file" v-on:change="importFile()"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
      </label>
        <input type="reset" value="清空" v-on:click="clearList()">
      <div>
        <q-btn class="full-width q-mt-md" label="提交转账" type="submit" color="primary" />
      </div>

      <div class='q-mt-sm q-mb-none'>
        <p>账户数：{{totalAccount}}，数量：{{String(totalAmount.toFixed(4).toString()).replace(/^(-?)(\d+)((\.\d+)?)$/,
          function (s, s1, s2, s3) {return s1 + s2.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') + s3})
        }}</p>
        <input class='q-mt-none q-mb-sm' type="button" value="刷新转账进度" v-on:click="onReflush()">
      </div>

      <q-table
        :data="data"
        :columns="columns"
        row-key="name"
        dense
        :pagination.sync="pagination"
        no-data-label="没有数据"
        rows-per-page-label="每页行数："
        :rows-per-page-options="[25,50,100,0]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="num" :props="props"> {{ props.row.name }} </q-td>
            <q-td key="addr" :props="props">
              <q-badge v-bind:style="{ color: props.row.shortAddrColor }" color="white" >
                {{ props.row.addr }}
              </q-badge>
            </q-td>
            <q-td key="amount" :props="props"> {{ props.row.amount }} </q-td>
            <q-td key="txHash" :props="props"> {{ props.row.txHash }} </q-td>
            <q-td key="status" :props="props"> {{ props.row.status }} </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-form>
  </q-page>
</template>

<style>
</style>

<script>
import XLSX from 'xlsx'

export default {
  name: 'sendMoac',
  data () {
    return {
      chain3: this.GLOBAL.chain3,
      privateKey: '',
      isPwd: true,
      totalAmount: 0,
      totalAccount: 0,
      address: '',
      balance: 0,

      transitionStarted: false,

      imFile: '',
      outFile: '',
      pagination: {
        sortBy: 'name',
        descending: false,
        // page: 2,
        rowsPerPage: 25
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        { name: 'num', align: 'left', label: '编号', field: row => row.name, sortable: true },
        { name: 'addr', align: 'left', label: '地址', field: 'addr', sortable: true },
        { name: 'amount', align: 'left', label: '数量', field: 'amount', sortable: true },
        { name: 'txHash', align: 'left', label: 'Tx', field: 'txHash', sortable: true },
        { name: 'status', align: 'left', label: '进度', field: 'status', sortable: true }
      ],
      data: []
    }
  },
  methods: {
    // ****************************************************
    // ****************************************************
    getWalletInfo () {
      if (!this.chain3.isConnected()) {
        this.$q.dialog({ title: '<span class="text-red">警告</span>', message: 'Chain3没有连接', html: true })
        return
      }

      if (this.privateKey === null) return
      if (this.privateKey.length !== 66) {
        this.$q.dialog({ title: '警告', message: '私钥长度不对' })
        return
      }

      // 从私钥产生公钥, 获得账户余额
      this.address = this.GLOBAL.getWalletAddress(this.privateKey)
      this.balance = this.GLOBAL.getMoacBalance(this.chain3, this.address).toFixed(2)
    },

    // ****************************************************
    // ****************************************************
    onSubmit () {
      if (!this.chain3.isConnected()) {
        this.$q.dialog({ title: '<span class="text-red">警告</span>', message: 'Chain3没有连接', html: true })
        return
      }

      if (this.totalAccount === 0) return

      if (this.privateKey.length !== 66) {
        this.$q.dialog({ title: '警告', message: '私钥长度不对' })
        return
      }

      // 从私钥产生公钥, 获得账户余额
      this.address = this.GLOBAL.getWalletAddress(this.privateKey)
      this.balance = this.GLOBAL.getMoacBalance(this.chain3, this.address).toFixed(2)

      if (this.balance <= this.totalAmount + this.totalAccount * 0.0025) {
        this.$q.dialog({ title: '警告', message: '账户里没有足够的墨客' })
        return
      }

      var chain3 = this.chain3
      var that = this

      this.$q.dialog({ title: '确定',
        message: '你确定要进行转账吗？',
        cancel: '取消',
        ok: '确定',
        persistent: false
      }).onOk(() => {
        this.$q.loading.show({
          message: '转账中，请等待。。。'
        })

        var txcount = chain3.mc.getTransactionCount(that.address)

        iterator(0)
        function iterator (i) {
          if (i === that.totalAccount) {
            console.log('完成')
            that.$q.loading.hide()
            that.$q.dialog({ title: '警告', message: '完成' })
            that.transitionStarted = true
            return
          }
          // 准备签名
          var rawTx = {
            'from': that.address,
            'to': that.data[i].addr,
            'nonce': chain3.intToHex(txcount),
            'gasPrice': chain3.intToHex(25000000000),
            'gasLimit': chain3.intToHex(100000),
            'value': chain3.intToHex(chain3.toSha(that.data[i].amount, 'mc')),
            'chainId': chain3.version.network
          }
          var signedTx = chain3.signTransaction(rawTx, that.privateKey)
          chain3.mc.sendRawTransaction(signedTx, function (err, txHash) {
            if (!err) {
              that.data[i].txHash = txHash
            } else {
              that.data[i].txHash = 'FAIL'
            }
            console.log(that.data[i].txHash)
            that.data[i].status = ''
            txcount++
            iterator(i + 1)
          })
        }
      })
    },

    // ****************************************************
    // ****************************************************
    onReflush () {
      if (!this.transitionStarted) return

      var chain3 = this.chain3
      var that = this

      this.$q.loading.show({
        message: '刷新。。。'
      })
      iterator(0)
      function iterator (i) {
        if (i === that.totalAccount) {
          console.log('完成')
          that.$q.loading.hide()
          return
        }
        if (that.data[i].txHash !== 'FAIL') {
          chain3.mc.getTransaction(that.data[i].txHash, function (err, result) {
            if (!err) {
              if (result.blockNumber != null) {
                console.log('完成 - ', i + 1)
                that.data[i].status = '完成'
              } else {
                console.log('等待 - ', i + 1)
                that.data[i].status = '等待'
              }
            } else {
              console.log('错误 - ', i + 1)
              that.data[i].status = '错误'
            }
            iterator(i + 1)
          })
        } else {
          console.log('错误 - ', i + 1)
          that.data[i].status = '错误'
          iterator(i + 1)
        }
      }
    },
    // ****************************************************
    // ****************************************************
    clearList () {
      this.data = []
      this.totalAccount = 0
      this.totalAmount = 0
      this.transitionStarted = false
      this.$refs.file.value = ''
    },
    // ****************************************************
    // ****************************************************
    importFile () { // 导入excel
      var shortAddrWarning = false

      var f = this.$refs.file.files[0]
      var reader = new FileReader()
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
        /* 更新表单的数据 */
        this.data = []
        this.totalAccount = 0
        this.totalAmount = 0
        this.transitionStarted = false
        for (var i = 1; i < data.length; i++) {
          // 去除所有的空格
          var addr = data[i][1].replace(/\s/g, '')
          if (addr !== null && addr !== '' && addr.length !== 42 && addr.length !== 40) {
            this.$q.dialog({ title: '警告', message: '第' + i + '行地址有问题' })
            return
          }
          var shortAddrColor = 'black'
          if (addr.length === 40 && addr.substr(0, 2) !== '0x') {
            addr = '0x' + addr
            shortAddrColor = 'red'
            shortAddrWarning = true
          }
          if (!data[i][2]) {
            this.$q.dialog({ title: '警告', message: '第' + i + '行地址有问题' })
            return
          }
          var amount = data[i][2]
          this.data.push({
            name: i,
            addr: addr,
            amount: amount,
            txHash: '',
            status: '',
            shortAddrColor: shortAddrColor
          })
          this.totalAccount++
          this.totalAmount += parseFloat(data[i][2])
        }
        if (shortAddrWarning) {
          this.$q.dialog({ title: '警告', message: '地址前缺0x,已经补上（见红色）' })
        }
      }

      reader.readAsBinaryString(f)
    }
  },
  components: {
  }
}
</script>
