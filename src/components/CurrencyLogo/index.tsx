import { Currency, ETHER, Token } from '@mumbaiswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

const getTokenLogoURL = (address: string) => {
  if (address == "0x8544FE9D190fD7EC52860abBf45088E81Ee24a8c")
    return `https://cdn.dexscreener.com/https://assets.coingecko.com/coins/images/31126/large/5dajOmhM_400x400.jpg?1690777236`
  else if (address == "0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8")
    return `https://basescan.org/token/images/bald_32.png`;
  else if (address == "0x4200000000000000000000000000000000000006")
    return `https://assets.coingecko.com/coins/images/17238/large/aWETH_2x.png`;
  else if (address == "0xEB466342C4d449BC9f53A865D5Cb90586f405215")
    return `https://cdn.dexscreener.com/https://assets.coingecko.com/coins/images/26476/large/uausdc_D_3x.png?1690776252`;
  else
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
}

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo) <{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
