import { ChainId } from '@mumbaiswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x096c8b5391A86d629b0825c43B0e446A3C2e1Fbe',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
