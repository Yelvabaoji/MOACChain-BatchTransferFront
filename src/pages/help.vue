<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline color="secondary">
      <q-timeline-entry heading="">
        安全性
      </q-timeline-entry>

      <q-timeline-entry
        title="为什么需要输入私钥"
        color="orange"
        icon="vpn_key"
      >
        <div>
          转币操作是需要授权的。如果是通过钱包APP操作，则通过钱包APP获得授权。否则，需要输入私钥获得授权。
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="私钥存放在哪里？"
        color="orange"
        icon="delete"
      >
        <div>
          <p><span class="text-red">答案是私钥不存放。</span></p>
          <p>本工具所有的操作都在浏览器端进行。转币所需要的签名操作是在浏览器端进行，加密的签名而不是私钥直接和区块链进行交互。</p>
          <p>私钥只存在于当前页面，切换到别的页面后，私钥被清空，再进入需要再输入私钥。</p>
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading>
        操作注意事项
      </q-timeline-entry>

      <q-timeline-entry
        title="延迟性"
      >
        <div>
          注意区块链完成数据交易有一定的延迟性。而交易结果反映在区块浏览器中也有一定的延迟性。通常在提示操作完成以后，到浏览器显示交易记录也有一定的延迟。
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="保持足够的墨客"
      >
        <div>
          <p>注意转账交易是需要有足够的墨客作为汽油费用的。每一笔转账交易都需要。</p>
          <p>系统会预估所需要的墨客数量，如果不足，则会提示</p>
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading>
        功能
      </q-timeline-entry>

      <q-timeline-entry
        title="批量转账墨客"
        avatar="statics/icons/moac-logo1.jpg"
      >
        <div>
          <p>批量转墨客。用户先编辑好EXCEL文件，然后选择EXCEL文件，开始进行批量转账。</p>
          <p>注意文件内容可能的错误会被指出来，比如说地址格式错误，错误会以<span class="text-red">红色</span>显示出来。</p>
          <p>输入私钥，点击<q-icon color="blue" name="search" size="32px" />获得钱包地址，以及相应的钱包信息</p>
          <p>点击<strong> 刷新转账进度 </strong>按钮，查看转账进度</p>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="批量转ERC20代币"
        avatar="statics/icons/mvp-logo.png"
      >
        <div>
          <P>批量转ERC20代币。</P>
          <p>操作上唯一的不同是需要输入ERC20代币的智能合约地址。</p>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Excel模板下载"
        color="green"
        icon="cloud_download"
      >
        <div>
          <p>转账地址列表是通过excel文件提供的。菜单提供了excel模板文件的下载链接。注意必须严格按照格式来填写。</p>
          <p>转账数据从第2行开始</p>
          <p>转账数据，即<strong> 地址，数量 </strong>对必须在第2第3列</p>
        </div>
      </q-timeline-entry>

    </q-timeline>
  </div>
</template>
<script>
export default {
  name: 'batchTransferHelp'
}
</script>
