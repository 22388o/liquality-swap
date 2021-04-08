import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import cryptoassets from '@liquality/cryptoassets'
import { getFundExpiration, getClaimExpiration } from '../../utils/expiration'
import { shortenTransactionHash, getExplorerLink } from '../../utils/transactions'
import TimeProgressBar from '../../components/TimeProgressBar/TimeProgressBar'

class TopDetails extends Component {
    constructor (props) {
        super(props)
        this.state = this.getExpirationState()
      }
    
      getTransaction (party) {
        const tx = this.props.transactions[party].initiation
        if (!tx.hash) return null
    
        const asset = this.props.assets[party].currency
        const explorerLink = tx && getExplorerLink(tx, asset)
        tx.explorerLink = explorerLink
        return tx
      }
    
      getExpirationState () {
        const party = this.props.isPartyB ? 'b' : 'a'
        const expiration = this.props.isClaim ? getClaimExpiration(this.props.expiration, party) : getFundExpiration(this.props.expiration, party)
    
        return {
          start: expiration.start,
          duration: expiration.duration,
          expiration: expiration.time,
          now: moment(),
          transactions: {
            a: this.getTransaction('a'),
            b: this.getTransaction('b')
          }
        }
      }
    
      componentDidMount () {
        this.interval = setInterval(this.tick.bind(this), 1000)
      }
    
      componentWillUnmount () {
        clearInterval(this.interval)
      }
    
      tick () {
        this.setState(this.getExpirationState())
      }

    render () {
        const maxNow = this.state.now.isAfter(this.state.expiration) ? this.state.expiration : this.state.now
        const left = moment.duration(this.state.expiration.diff(maxNow))
        const passed = moment.duration(maxNow.diff(this.state.start))
        const total = this.state.duration

        const filled = (((total.asSeconds() - left.asSeconds()) / total.asSeconds()) * 100).toFixed(2)

        return <div className="TopDetails_bigWrap">

            <TimeProgressBar startTime={this.props.start} endTime={this.props.expiration} />

            <div className="TopDetails_progressBar">
                <div className='TopDetails_progress'>
                    <div className='TopDetails_progress_fill' style={{width: `${filled}%`}} />
                </div>
            </div>

            <div className="SwapRedemption_whiteBar">
                <p>Swap {this.props.assets.a.value.toFixed()} {cryptoassets[this.props.assets.a.currency].code} for {this.props.assets.b.value.toFixed()} {cryptoassets[this.props.assets.b.currency].code}</p>
            </div>

        </div>
    }
}

TopDetails.propTypes = {
    isClaim: PropTypes.bool,
    startTime: PropTypes.number,
    endTime: PropTypes.number
  }
  
  export default TopDetails;