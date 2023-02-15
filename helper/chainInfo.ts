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
      rpc: 'https://polygon.llamarpc.com',
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

export function chainList ():LeftCoin[] {
    const { t } = useI18n()
    return [
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/history_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/history.png",
          title: t("historical"),
          code: "history",
          queryType: 'history',
          chain: null
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/allCoin_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/allCoin.png",
          title: t("allCoin"),
          code: "allChain",
          queryType: 'allChain',
          chain: null
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/bsc_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/bsc.png",
          title: 'BNB Chain',
          code: "bsc",
          queryType: 'chain',
          chain: 'bsc'
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/eth_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/eth.png",
          title: 'Ethereum',
          code: "eth",
          queryType: 'chain',
          chain: 'eth'
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/polygon_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/polygon.png",
          title: 'Polygon',
          code: "polygon",
          queryType: 'chain',
          chain: 'polygon'
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/tron_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/tron.png",
          title: "Tron",
          code: "tron",
          queryType: 'chain',
          chain: 'tron'
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/arbitrum_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/arbitrum.png",
          title: "Arbitrum",
          code: "arbitrum",
          queryType: 'chain',
          chain: 'arbitrum'
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/optimistic_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/optimistic.png",
          title: "Optimism",
          code: "optimistic",
          queryType: 'chain',
          chain: 'optimistic'
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/heco_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/heco.png",
          title: "Heco",
          code: "heco",
          queryType: 'chain',
          chain: 'heco'
        },
        {
          lightIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/okex_l.png",
          darkIcon: "https://swap-jp.s3-accelerate.amazonaws.com/chain/okex.png",
          title: "OKX",
          code: "okex",
          queryType: 'chain',
          chain: 'okex'
        },
    ]
}
    