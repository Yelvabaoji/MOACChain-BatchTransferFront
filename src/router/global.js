
import secp256k1 from 'secp256k1'
import keccak from 'keccak'
import moacERC20ABI from '../pages/moacERC20ABI.js'

var chain3

function getWalletAddress (privateKey) {
  // 去除私钥的0x
  var pKey = privateKey
  if (pKey.substr(0, 2) === '0x') {
    pKey = pKey.substr(2, pKey.length)
  }
  // 从私钥产生公钥
  var publicKey = secp256k1.publicKeyCreate(Buffer.from(pKey, 'hex'), false).slice(1)
  var addrBuffer = keccak('keccak256').update(publicKey).digest().slice(-20)
  var address = '0x' + addrBuffer.toString('hex')
  return address
}

function getMoacBalance (chain3, address) {
  // get moac balance in the wallet, convert to moac.
  var balBig = chain3.BigNumber(chain3.mc.getBalance(address).toString(10))
  var balance = balBig.dividedBy(10 ** 18)
  return balance
}

function getTokenInfo (chain3, erc20Address) {
  var token = {
    name: '',
    symb: '',
    decimals: 0,
    totalSupply: 0
  }
  var contract = chain3.mc.contract(moacERC20ABI.moacERC20ABI).at(erc20Address)
  if (contract) {
    var totalSupplyBig = chain3.BigNumber(JSON.stringify(contract.totalSupply()).replace(/"/g, ''))
    var name = JSON.stringify(contract.name()).replace(/"/g, '')
    var decimals = parseInt(JSON.stringify(contract.decimals()).replace(/"/g, ''))
    var symb = JSON.stringify(contract.symbol()).replace(/"/g, '')
    var totalSupply = decimals === 0 ? totalSupplyBig : totalSupplyBig.dividedBy(10 ** decimals)
    console.log('name:', name, 'SYM:', symb, 'decimals:', decimals, 'total:', totalSupply.toString())
    token.name = name
    token.symb = symb
    token.decimals = decimals
    token.totalSupply = totalSupply
  }
  return token
}

async function getTokenBalance (chain3, erc20Address, address, decimals) {
  var contract = chain3.mc.contract(moacERC20ABI.moacERC20ABI).at(erc20Address)
  if (contract) {
    var balBig = await contract.balanceOf.call(address)
    var balance = balBig.dividedBy(10 ** decimals)
    return balance
  }
  return 0
}

function getContract (chain3, erc20Address) {
  return chain3.mc.contract(moacERC20ABI.moacERC20ABI).at(erc20Address)
}

export default {
  chain3,
  getWalletAddress,
  getMoacBalance,
  getTokenInfo,
  getTokenBalance,
  getContract
}
