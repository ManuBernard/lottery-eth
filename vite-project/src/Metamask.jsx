import React, { Component } from "react"

import { ethers } from "ethers"

import ABI from "./lottery.abi.json"
const address = "0x24EAE84aB19189cAf26A715C292B51526C0796E7"
const network = "sepolia"

class Metamask extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
    }
  }

  isOwner() {
    if (!this.state.selectedAddress) return false
    const ownerAddress = ethers.utils.getAddress(this.state.owner)
    const selectedAddress = ethers.utils.getAddress(this.state.selectedAddress)

    console.log(ownerAddress, selectedAddress)
    const isOwner = ownerAddress === selectedAddress
    console.log(isOwner)
    return isOwner
  }

  async connectToMetamask() {
    console.log(ethers)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", [])

    this.setState({
      provider: provider,
      selectedAddress: accounts[0],
    })
  }

  componentDidMount() {
    this.getData()
  }

  async getData() {
    const provider = ethers.getDefaultProvider(network)

    const contract = new ethers.Contract(address, ABI, provider)

    const ballance = await contract.getBallance()
    const players = await contract.getPlayers()
    const owner = await contract.getOwner()

    this.setState({
      ballance: ethers.utils.formatEther(ballance),
      players: players,
      owner: owner,
      loading: false,
    })
  }

  async buyTicket() {
    const signer = this.state.provider.getSigner()
    const contract = new ethers.Contract(address, ABI, signer)

    this.setState({
      loading: true,
    })

    try {
      await contract.buyTicket({ value: ethers.utils.parseEther("0.0001") })
    } catch (e) {
      console.log(e)
    }

    this.setState({
      loading: false,
    })
  }

  async pickWinner() {
    const signer = this.state.provider.getSigner()
    const contract = new ethers.Contract(address, ABI, signer)

    this.setState({
      loading: true,
    })

    try {
      await contract.pickWinner()
    } catch (e) {
      console.log(e)
    }

    this.setState({
      loading: false,
    })
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <button onClick={() => this.connectToMetamask()}>
          Connect to Metamask
        </button>
      )
    } else {
      return (
        <>
          <p>Welcome {this.state.selectedAddress}</p>
          <button onClick={() => this.buyTicket()}>Buy Ticket</button>
        </>
      )
    }
  }

  render() {
    return (
      <>
        {this.state.loading && <p>Loading...</p>}
        {!this.state.loading && (
          <div>
            <h1>Lottery ballance : {this.state.ballance}</h1>

            {this.renderMetamask()}

            <h3>Lottery Owner : {this.state.owner}</h3>
            {this.isOwner() && (
              <div style={{ padding: "10px", border: "1px solid white" }}>
                <p>This is you</p>
                <button onClick={() => this.pickWinner()}>Pick Winner</button>
              </div>
            )}

            <h1>Players</h1>
            <ul style={{ textAlign: "left" }}>
              {this.state.players &&
                this.state.players.map((player) => (
                  <li key={player}>{player}</li>
                ))}
            </ul>
          </div>
        )}
      </>
    )
  }
}

export default Metamask
