import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair } from '@mumbaiswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Question from '../../components/QuestionHelper'
import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { Button, Text } from 'rebass'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'

export default function Farm() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  return (
    <>
      <AppBody>
        <SwapPoolTabs active={'farm'} />
        <div
          style={{
            // border: '1px solid red',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 15px 15px'
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 2%'
            }}
          >
            <p
              style={{
                width: '32%',
                color: '#fff',
                fontSize: '16px'
              }}
            >
              Stake
            </p>
            <p
              style={{
                width: '32%',
                color: '#fff',
                fontSize: '16px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              TVL
            </p>
            <p
              style={{
                width: '32%',
                color: '#fff',
                fontSize: '16px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'end'
              }}
            >
              APR
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              borderRadius: '15px',
              background: 'rgba(255,255,255,0.08)',
              padding: '10px'
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  width: '33%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{

                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'left'
                  }}
                >
                  <img
                    alt=""
                    src="https://yinyangswap.com/static/media/logo.2b66e514.png"
                    style={{
                      width: '42px',
                      height: '42px'
                    }}
                  />
                  <img
                    alt=""
                    src="https://assets.coingecko.com/coins/images/17238/large/aWETH_2x.png"
                    style={{
                      width: '42px',
                      height: '42px'
                    }}
                  />


                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    justifyContent: 'left'
                  }}
                >
                  <span
                    style={{
                      marginLeft: '10px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 700
                    }}
                  >
                    YIN
                  </span>
                  <span
                    style={{
                      marginLeft: '10px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 700
                    }}
                  >
                    WETH
                  </span>

                </div>
              </div>
              <div
                style={{
                  width: '33%'
                }}
              >
                <p
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  $292.74 K
                </p>
              </div>
              <div
                style={{
                  width: '33%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'end',
                  justifyContent: 'center'
                }}
              >
                <span
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700
                  }}
                >
                  286944%
                </span>
                <span
                  style={{
                    color: 'gray',
                    fontSize: '14px'
                  }}
                >
                  annualized
                </span>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  width: 'calc(50% - 5px)'
                }}
              >
                <p
                  style={{
                    marginLeft: '10px',
                    color: 'gray',
                    fontSize: '14px'
                  }}
                >
                  Wallet Balance: 0.0000 ($0.00)
                </p>
                <input
                  style={{
                    width: '100%',
                    height: '48px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '10px'
                  }}
                />
              </div>
              <div
                style={{
                  width: 'calc(50% - 5px)'
                }}
              >
                <p
                  style={{
                    marginLeft: '10px',
                    color: 'gray',
                    fontSize: '14px'
                  }}
                >
                  Your Staked: 0.0000 ($0.00)
                </p>
                <input
                  style={{
                    width: '100%',
                    height: '48px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </div>
            <div
              style={{
                marginTop: '20px',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                sx={{
                  width: 'calc(50% - 5px)',
                  borderRadius: '10px',
                  color: 'black'
                }}
              >
                Stake
              </Button>
              <Button
                sx={{
                  width: 'calc(50% - 5px)',
                  borderRadius: '10px',
                  color: 'black'
                }}
              >
                Unstake
              </Button>
            </div>
          </div>
        </div>
      </AppBody>
    </>
  )
}
