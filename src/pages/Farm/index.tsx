import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext, withTheme } from 'styled-components'
import { Currency, Pair, Token } from '@mumbaiswap/sdk'
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
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { LPTOKEN, TOSHI } from '../../constants'
import { useFarmContract, useTokenContract, useWETHContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { NEVER_RELOAD, useSingleCallResult } from '../../state/multicall/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
import { padding } from 'polished'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { TokenAmount } from '@mumbaiswap/sdk'

export default function Farm() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const farmContract = useFarmContract()
  const walletBalance = useCurrencyBalance(account ?? undefined, LPTOKEN)
  // const stakedBalance = useSingleCallResult(farmContract, 'tokenFarmList', [account ?? undefined], NEVER_RELOAD)
  //   ?.result?.[0]
  const stakedBalance = useSingleCallResult(farmContract, 'userBalance', [account ?? undefined, "0x219cF3c02dd082fED83850DFF4ED49D57A2C6ddA"])
    ?.result?.[0];
  const stakedToken = stakedBalance && new TokenAmount(LPTOKEN, stakedBalance?.toString())

  const totalTVL = useSingleCallResult(farmContract, 'totalTVL')?.result?.[0]

  const totalTVLToken = totalTVL && new TokenAmount(LPTOKEN, totalTVL.toString())

  const [inputAmount, setInputAmount] = useState('0.0')
  const [outAmount, setOutAmount] = useState('0.0')
  const DepositAmount = useMemo(() => tryParseAmount(inputAmount, LPTOKEN), [LPTOKEN, inputAmount])
  const WithdrawAmount = useMemo(() => tryParseAmount(outAmount, LPTOKEN), [LPTOKEN, outAmount])
  const addTransaction = useTransactionAdder()

  const [approvalA, approveACallback] = useApproveCallback(DepositAmount, "0x10E02f9b8dBB71B3761044E63F689Ff774CeE70B")


  // useEffect(() => {
  //   // if (farmContract) console.log('**********Farm Contract', farmContract)

  //   // if (stakedBalance) console.log('**********stakedBalance', stakedBalance)

  //   // if (walletBalance) console.log('**********walletBalance', walletBalance)
  // }, [farmContract, stakedBalance, walletBalance])

  const handleMaxWalletBalance = () => {
    if (walletBalance)
      setInputAmount(walletBalance.toSignificant(6).toString());
  }

  const handleStakedBalance = () => {
    if (stakedToken)
      setOutAmount(stakedToken?.toSignificant(6));
  }

  const deposit = async () => {
    if (!farmContract || !DepositAmount) return
    try {
      const txReceipt = await farmContract.deposit(
        '0x219cF3c02dd082fED83850DFF4ED49D57A2C6ddA',
        `0x${DepositAmount.raw.toString(16)}`
      )
      addTransaction(txReceipt, { summary: `LP Token ${DepositAmount.toSignificant(6)} Deposit` })
    } catch (error) {
      console.error('Could not deposit', error)
    }
  }

  useEffect(() => {
    if (approvalA === ApprovalState.APPROVED) {
      deposit();
    }
  }, [approvalA])

  const handleDeposit = async () => {
    if (!farmContract || !DepositAmount) return

    approveACallback();

  }

  const handleWithdraw = async () => {
    if (!farmContract || !WithdrawAmount) return

    try {
      const txReceipt = await farmContract.withdraw(
        '0x219cF3c02dd082fED83850DFF4ED49D57A2C6ddA',
        `0x${WithdrawAmount.raw.toString(16)}`
      )
      addTransaction(txReceipt, { summary: `LP Token ${WithdrawAmount.toSignificant(6)} Withdraw` })
    } catch (error) {
      console.error('Could not withdraw', error)
    }
  }

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
                  {totalTVLToken?.toSignificant(6)} &nbsp;
                  <span
                    style={{
                      color: '#ddd',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    {' '}
                    {totalTVL ? ' LP Token' : '-'}
                  </span>
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
                  {totalTVL ? "286944%" : "-"}
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
                  Wallet Balance: {walletBalance ? walletBalance.toSignificant(6) : '-'}
                </p>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <input
                    className="no-arrows"
                    value={inputAmount}
                    onChange={e => {
                      if (parseFloat(e.target.value) <= 0) setInputAmount('0')
                      else setInputAmount(parseFloat(e.target.value).toString())
                    }}
                    style={{
                      width: '100%',
                      height: '48px',
                      color: '#fff',
                      fontSize: '16px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '0 10px'
                    }}
                    type="number"
                  />
                  <Button
                    sx={{
                      position: 'absolute',
                      right: '10px',
                      background: walletBalance && '#153d6f70',
                      color: '#6da8ff',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      border: '1px solid #153d6f70',
                      ':hover': {
                        border: walletBalance && '1px solid #6da8ff'
                      }
                    }}
                    disabled={walletBalance ? false : true}
                    onClick={handleMaxWalletBalance}
                  >
                    MAX
                  </Button>
                </div>
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
                  Your Staked: {stakedToken ? stakedToken.toSignificant(6) : '-'}
                </p>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <input
                    className="no-arrows"
                    value={outAmount}
                    onChange={e => {
                      if (parseFloat(e.target.value) <= 0) setOutAmount('0')
                      else setOutAmount(parseFloat(e.target.value).toString())
                    }}
                    style={{
                      color: '#fff',
                      fontSize: '16px',
                      width: '100%',
                      height: '48px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '0 10px'
                    }}
                    type="number"
                  />
                  <Button
                    sx={{
                      position: 'absolute',
                      right: '10px',
                      background: stakedBalance && '#153d6f70',
                      color: '#6da8ff',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      border: '1px solid #153d6f70',
                      ':hover': {
                        border: stakedBalance && '1px solid #6da8ff'
                      }
                    }}
                    onClick={handleStakedBalance}
                    disabled={stakedBalance ? false : true}
                  >
                    MAX
                  </Button>
                </div>
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
                  color: 'black',
                  ':hover': {
                    cursor: 'pointer'
                  }
                }}
                disabled={walletBalance ? false : true}
                onClick={handleDeposit}
              >
                Stake
              </Button>
              <Button
                sx={{
                  width: 'calc(50% - 5px)',
                  borderRadius: '10px',
                  color: 'black',
                  cursor: 'pointer'
                }}
                onClick={handleWithdraw}
                disabled={stakedBalance ? false : true}
              >
                Unstake
              </Button>
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
                  width: 'calc(100% - 5px)',
                  borderRadius: '10px',
                  color: 'black',
                  ':hover': {
                    cursor: 'pointer'
                  }
                }}
                // disabled={walletBalance ? false : true}
                onClick={() => alert("You can claim rewards every 24 hours.")}
              >
                Claim
              </Button>

            </div>
          </div>
        </div>
      </AppBody>
    </>
  )
}
