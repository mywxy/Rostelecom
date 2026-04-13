import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

function App() {
  const [account, setAccount] = useState('')
  const [tokens, setTokens] = useState('no')
  const [status, setStatus] = useState('')
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)

  const getProvider = () => {
    if (typeof window === 'undefined' || !window.ethereum) return null
    return new ethers.providers.Web3Provider(window.ethereum, 'any')
  }

  async function switchToHardhat() {
    if (typeof window === 'undefined' || !window.ethereum) {
      setStatus('MetaMask не найден')
      return
    }
    try {
      setStatus('')
      console.log('ethereum provider info:', {
        isMetaMask: window.ethereum.isMetaMask,
        chainId: window.ethereum.chainId,
        selectedAddress: window.ethereum.selectedAddress,
      })
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7a69' }],
      })
    } catch (err) {
      if (err?.code === 4902) {
        setStatus('Сеть hardhat не добавлена в MetaMask (код 4902). Добавь сеть и попробуй снова.')
        return
      }
      console.error(err)
      setStatus(err?.message || String(err))
    }
  }

  async function updateAccount() {
    const provider = getProvider()
    if (!provider) {
      console.warn('MetaMask или другой Web3-провайдер не найден')
      setStatus('MetaMask не найден')
      return
    }
    try {
      setStatus('')

      const chainIdHex = await provider.send('eth_chainId', [])
      const chainId = Number.parseInt(chainIdHex, 16)
      console.log('chainId: ', chainId, '(', chainIdHex, ')')
      if (chainId !== 31337) {
        setStatus(`Неверная сеть (chainId=${chainId}). Выбери hardhat (31337).`)
      }

      const code = await provider.getCode(CONTRACT_ADDRESS)
      if (code === '0x') {
        setStatus(
          `По адресу ${CONTRACT_ADDRESS} нет контракта в текущей сети. Проверь сеть MetaMask и адрес.`
        )
        return
      }

      const accounts = await provider.send('eth_requestAccounts', [])
      console.log('Available accounts: ', accounts)
      const acc = accounts[0]
      setAccount(acc)

      const s = provider.getSigner()
      setSigner(s)
      console.log('Signer: ', s)

      const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, s)
      console.log('Contract: ', c)
      setContract(c)

      const bal = await c.balanceOf(acc)
      console.log('Tokens: ', bal)
      setTokens(bal.toString())
    } catch (err) {
      console.error(err)
      setStatus(err?.message || String(err))
    }
  }

  async function transferToken() {
    const address = document.getElementById('address').value
    const amount = document.getElementById('amount').value
    console.log('Signer: ', signer)
    console.log('Contract: ', contract)

    if (!contract || !signer) {
      console.warn('Сначала нажмите Update Balance')
      return
    }

    const trx = await contract.connect(signer).transfer(address, amount)
    console.log('Transaction: ', trx)
    await trx.wait()
    await updateAccount()
  }

  return (
    <>
      <h1>Token vending machine</h1>
      <h3>
        Current account {account || '—'} has {tokens} Tokens
      </h3>
      {status ? <p style={{ color: '#f88' }}>{status}</p> : null}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          switchToHardhat()
        }}
      >
        Switch to Hardhat
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          updateAccount()
        }}
      >
        Update Balance
      </button>

      <div>
        <label htmlFor="address">
          Send to:
          <input type="text" id="address" />
        </label>
        <label htmlFor="amount">
          Amount:
          <input type="text" id="amount" />
        </label>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            transferToken()
          }}
        >
          Transfer
        </button>
      </div>
    </>
  )
}

export default App
