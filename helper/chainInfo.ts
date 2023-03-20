interface ChainMap {
  [x:string ]:ChainInfo,
}

export interface ChainInfo{
  fullName: string,
  chainId?: string,
  defaultTrade:Coins[],
  rpc: string,
  lightIcon: string,
  darkIcon: string,
  coinUnit: string,
  scanAddress: string
}

export interface Coins{
  type: string,
  chain: string,
  symbol: string,
  token: string,
  decimals: number,
  logo: string,
  amount: string|number,
}

export const chainInfo:ChainMap = {
  bsc:{
      fullName: 'BNB Chain',
      chainId: '56',
      defaultTrade: [
        {
            type: "pay",
            chain: "bsc",
            symbol: "USDT",
            token: "0x55d398326f99059ff775485246999027b3197955",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/bsc/0x55d398326f99059ff775485246999027b3197955.png",
            amount: "",
        },
        {
            type: "receive",
            chain: "bsc",
            symbol: "BNB",
            token: "0x000",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/bsc/0x000.png",
            amount: "",
        },
      ],
      rpc: 'https://bsc-dataseed1.defibit.io',
      lightIcon: '@/assets/images/home_bsc_l.png',
      darkIcon: '@/assets/images/home_bsc_d.png',
      coinUnit: 'BNB',
      scanAddress: 'https://bscscan.com/tx/'
  },
  eth:{
      fullName: 'Ethereum',
      chainId: '1',
      defaultTrade: [
        {
            type: "pay",
            chain: "eth",
            symbol: "USDT",
            token: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            decimals: 6,
            logo: "https://swap-jp.s3.amazonaws.com/file/eth/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
            amount: "",
        },
        {
            type: "receive",
            chain: "eth",
            symbol: "ETH",
            token: "0x000",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/eth/0x000.png",
            amount: "",
        },
      ],
      rpc: 'https://rpc.ankr.com/eth',
      lightIcon: '@/assets/images/home_eth_l.png',
      darkIcon: '@/assets/images/home_eth_d.png',
      coinUnit: 'ETH',
      scanAddress: 'https://etherscan.com/tx/'
  },
  polygon:{
      fullName: 'Polygon',
      chainId: '137',
      defaultTrade: [
        {
            type: "pay",
            chain: "polygon",
            symbol: "USDT",
            token: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            decimals: 6,
            logo: "https://swap-jp.s3.amazonaws.com/file/polygon/0xc2132d05d31c914a87c6611c10748aeb04b58e8f.png",
            amount: "",
        },
        {
            type: "receive",
            chain: "polygon",
            symbol: "MATIC",
            token: "0x000",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/polygon/0x000.png",
            amount: "",
        },
      ],
      rpc: 'https://polygon-bor.publicnode.com',
      lightIcon: '@/assets/images/home_polygon_l.png',
      darkIcon: '@/assets/images/home_polygon_d.png',
      coinUnit: 'MATIC',
      scanAddress: 'https://polygonscan.com/tx/'
  },
  tron:{
      fullName: 'Tron',
      defaultTrade: [
        {
            type: "pay",
            chain: "tron",
            symbol: "USDT",
            token: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            decimals: 6,
            logo: "https://swap-jp.s3.amazonaws.com/file/tron/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t.png",
            amount: "",
        },
        {
            type: "receive",
            chain: "tron",
            symbol: "TRX",
            token: "0x000",
            decimals: 6,
            logo: "https://swap-jp.s3.amazonaws.com/file/tron/0x000.png",
            amount: "",
        },
      ],
      rpc: '',
      lightIcon: '@/assets/images/home_tron_l.png',
      darkIcon: '@/assets/images/home_tron_d.png',
      coinUnit: 'TRX',
      scanAddress: 'https://tronscan.org/#/transaction/'
  },
  arbitrum:{
      fullName: 'Arbitrum',
      chainId: '42161',
      defaultTrade: [
        {
            type: "pay",
            chain: "arbitrum",
            symbol: "USDT",
            token: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
            decimals: 6,
            logo: "https://swap-jp.s3.amazonaws.com/file/arbitrum/0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9.png",
            amount: "",
        },
        {
            type: "receive",
            chain: "arbitrum",
            symbol: "ETH",
            token: "0x000",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/arbitrum/0x000.png",
            amount: "",
        },
      ],
      rpc: 'https://arb1.arbitrum.io/rpc',
      lightIcon: '@/assets/images/home_ar_l.png',
      darkIcon: '@/assets/images/home_ar_d.png',
      coinUnit: 'ETH',
      scanAddress: 'https://arbiscan.io/tx/'
  },
  optimistic: {
      fullName: 'Optimism',
      chainId: '10',
      defaultTrade: [
        {
            type: "pay",
            chain: "optimistic",
            symbol: "USDT",
            token: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
            decimals: 6,
            logo: "https://swap-jp.s3.amazonaws.com/file/optimistic/0x94b008aA00579c1307B0EF2c499aD98a8ce58e58.png",
            amount: "",
        },
        {
            type: "receive",
            chain: "optimistic",
            symbol: "ETH",
            token: "0x000",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/optimistic/0x000.png",
            amount: "",
        },
      ],
      rpc: 'https://endpoints.omniatech.io/v1/op/mainnet/public',
      lightIcon: '@/assets/images/home_op_l.png',
      darkIcon: '@/assets/images/home_op_d.png',
      coinUnit: 'ETH',
      scanAddress: 'https://optimistic.etherscan.io/tx/'
  },
  heco:{
      fullName: 'Heco',
      chainId: '128',
      defaultTrade: [
        {
            type: "pay",
            chain: "heco",
            symbol: "USDT",
            token: "0xa71edc38d189767582c38a3145b5873052c3e47a",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/heco/0xa71edc38d189767582c38a3145b5873052c3e47a.png",
            amount: "",
        },
        {
            type: "receive",
            chain: "heco",
            symbol: "HT",
            token: "0x000",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/heco/0x000.png",
            amount: "",
        },
      ],
      rpc: 'https://http-mainnet.hecochain.com',
      lightIcon: '@/assets/images/home_heco_l.png',
      darkIcon: '@/assets/images/home_heco_d.png',
      coinUnit: 'HT',
      scanAddress: 'https://www.hecoinfo.com/en-us/tx/'
  },
  okex: {
      fullName: 'OKX',
      chainId: '66',
      defaultTrade: [
        {
            type: "pay",
            chain: "okex",
            symbol: "USDT",
            token: "0x382bb369d343125bfb2117af9c149795c6c65c50",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/okex/0x382bb369d343125bfb2117af9c149795c6c65c50.png",
            amount: "",
        },
        {
            type: "receive",
            chain: "okex",
            symbol: "OKT",
            token: "0x000",
            decimals: 18,
            logo: "https://swap-jp.s3.amazonaws.com/file/okex/0x000.png",
            amount: "",
        },
      ],
      rpc: 'https://exchainrpc.okex.org',
      lightIcon: '@/assets/images/home_okex_l.png',
      darkIcon: '@/assets/images/home_okex_d.png',
      coinUnit: 'OKT',
      scanAddress: 'https://www.oklink.com/en/okc/tx/'
  } 
}
interface PlatformsValue {

}
export const platformsValue: PlatformsValue = {
    pancake: 'Pancakeswap',
    biswap: 'Biswap',
    mdex: "Mdex",
    apeswap: "Apeswap",
    sushiswap: "Sushiswap",
    uniV2swap: "UniswapV2",
    uniV3swap: "UniswapV3",
    sunswap: "Sunswap",
    cherryswap: "Cherryswap",
    kswap: "Kswap",
    fstswap: "FstSwap",
    quickswap: "QuickSwap",
    babyswap: "BabySwap",
    pandoraswap: "PandoraSwap",
    bakeryswap: "BakerySwap",
    babydogeswap: "BabydogeSwap",
    w3swap: "W3Swap",
    knightswap: "KnightSwap",
    shibaswap: "ShibaSwap",
    unicswap: "UnicSwap",
    defiswap: "DefiSwap",
    fraxswap: "RadioshackSwap",
    radioshackswap: "FraxSwap",
    luaswap: "LuaSwap",
    verseswap: 'VerseSwap'
}

interface LeftCoin {
  lightIcon: string,
  darkIcon: string,
  title: string,
  code: string,
  queryType: string,
  chain: any
}

import home_history_l from '~~/assets/images/home_history_l.png'
import home_history_d from '~~/assets/images/home_history_d.png'
import home_allCoin_l from '~~/assets/images/home_allCoin_l.png'
import home_allCoin_d from '~~/assets/images/home_allCoin_d.png'
import home_bsc_l from '~~/assets/images/home_bsc_l.png'
import home_bsc_d from '~~/assets/images/home_bsc_d.png'
import home_eth_l from '~~/assets/images/home_eth_l.png'
import home_eth_d from '~~/assets/images/home_eth_d.png'
import home_polygon_l from '~~/assets/images/home_polygon_l.png'
import home_polygon_d from '~~/assets/images/home_polygon_d.png'
import home_tron_l from '~~/assets/images/home_tron_l.png'
import home_tron_d from '~~/assets/images/home_tron_d.png'
import home_arbitrum_l from '~~/assets/images/home_arbitrum_l.png'
import home_arbitrum_d from '~~/assets/images/home_arbitrum_d.png'
import home_optimistic_l from '~~/assets/images/home_optimistic_l.png'
import home_optimistic_d from '~~/assets/images/home_optimistic_d.png'
import home_heco_l from '~~/assets/images/home_heco_l.png'
import home_heco_d from '~~/assets/images/home_heco_d.png'
import home_okex_l from '~~/assets/images/home_okex_l.png'
import home_okex_d from '~~/assets/images/home_okex_d.png'
export function chainList ():LeftCoin[] {
    const { t } = useI18n()
    return [
        {
          lightIcon: home_history_l,
          darkIcon: home_history_d,
          title: t("historical"),
          code: "history",
          queryType: 'history',
          chain: null
        },
        {
          lightIcon: home_allCoin_l,
          darkIcon: home_allCoin_d,
          title: t("allCoin"),
          code: "allChain",
          queryType: 'allChain',
          chain: null
        },
        {
          lightIcon: home_bsc_l,
          darkIcon: home_bsc_d,
          title: 'BNB Chain',
          code: "bsc",
          queryType: 'chain',
          chain: 'bsc'
        },
        {
          lightIcon: home_eth_l,
          darkIcon: home_eth_d,
          title: 'Ethereum',
          code: "eth",
          queryType: 'chain',
          chain: 'eth'
        },
        {
          lightIcon: home_polygon_l,
          darkIcon: home_polygon_d,
          title: 'Polygon',
          code: "polygon",
          queryType: 'chain',
          chain: 'polygon'
        },
        {
          lightIcon: home_tron_l,
          darkIcon: home_tron_d,
          title: "Tron",
          code: "tron",
          queryType: 'chain',
          chain: 'tron'
        },
        {
          lightIcon: home_arbitrum_l,
          darkIcon: home_arbitrum_d,
          title: "Arbitrum",
          code: "arbitrum",
          queryType: 'chain',
          chain: 'arbitrum'
        },
        {
          lightIcon: home_optimistic_l,
          darkIcon: home_optimistic_d,
          title: "Optimism",
          code: "optimistic",
          queryType: 'chain',
          chain: 'optimistic'
        },
        {
          lightIcon: home_heco_l,
          darkIcon: home_heco_d,
          title: "Heco",
          code: "heco",
          queryType: 'chain',
          chain: 'heco'
        },
        {
          lightIcon: home_okex_l,
          darkIcon: home_okex_d,
          title: "OKX",
          code: "okex",
          queryType: 'chain',
          chain: 'okex'
        },
    ]
}

export const ETHChain:string[] = ['bsc', 'eth', 'polygon', "arbitrum", "optimistic", "heco", "okex"]
export const TRONChain:string[] = ["tron"]
    