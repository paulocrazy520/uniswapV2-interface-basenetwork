import { ChainId } from '@mumbaiswap/sdk'
import React, { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { Button, Text } from 'rebass'

import styled from 'styled-components'

import Logo from '../../assets/svg/logo.svg'
import LogoDark from '../../assets/svg/logo_white.svg'
import Wordmark from '../../assets/svg/wordmark.svg'
import WordmarkDark from '../../assets/svg/wordmark_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import VersionSwitch from './VersionSwitch'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  max-width: 1320px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  z-index: 2;
  background: #00000080;
  padding: 12px 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  // transition: transform 0.3s ease;
  // :hover {
  //   transform: rotate(-5deg);
  // }
  img {
    width: 70px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      // width: 4.5rem;
      width: 70px;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: 'Base',
  [ChainId.GÖRLI]: 'Görli'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()

  const [isHome, setIsHome] = useState(true)

  useEffect(() => {
    const handleUrlChange = () => {
      const currentUrl = window.location.href
      const splitUrl = currentUrl.split('/')
      const currentPage = splitUrl[splitUrl.length - 1]
      console.log('Header log - 1 : ', currentPage)
      if (currentPage === 'home') {
        setIsHome(true)
      } else {
        setIsHome(false)
      }
    }

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href=".">
            <UniIcon>
              {/* <img src={isDark ? LogoDark : Logo} alt="logo" /> */}
              <img src={Logo} alt="logo" />
            </UniIcon>
            {/* <TitleText>
              <img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" />
            </TitleText> */}
          </Title>
        </HeaderElement>
        <HeaderControls>
          <HeaderElement>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              {!isHome ? (
                <a href="/#/home">
                  <Button
                    sx={{
                      background: 'transparent',
                      color: 'white',
                      fontSize: '16px',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      position: 'relative',
                      ':before': {
                        content: "''",
                        position: 'absolute',
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        right: '15px',
                        top: '0',
                        background: '#fff'
                      },
                      ':after': {
                        content: "''",
                        position: 'absolute',
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        left: '15px',
                        bottom: '0',
                        background: '#005BE9'
                      }
                    }}
                  >
                    Yin Yang Swap
                  </Button>
                </a>
              ) : (
                <a href="/#/swap">
                  <Button
                    sx={{
                      background: 'linear-gradient(111.55deg,rgba(0,91,233,.47) 19.98%,rgba(0,91,233,.66) 94.85%)',
                      border: '3px solid #005BE9',
                      padding: '16px 24px',
                      borderRadius: '20px',
                      backdropFilter: 'blur(5px)',
                      boxShadow: '0 0 12px rgba(0,91,233,.17)',
                      color: 'white',
                      fontSize: '16px',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      ':hover': {
                        background: 'linear-gradient(180deg,rgba(0,91,233,.42) 0,rgba(0,91,233,.17) 100%)'
                      }
                    }}
                  >
                    Launch App
                  </Button>
                </a>
              )}
            </div>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            {/* <VersionSwitch /> */}
            <Settings />
            {/* <Menu /> */}
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
