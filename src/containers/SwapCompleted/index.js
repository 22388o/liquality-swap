import { connect } from 'react-redux'
import SwapCompleted from './SwapCompleted'

const mapStateToProps = state => {
  return {
    expiration: state.swap.expiration,
    isPartyB: state.swap.isPartyB,
    assets: state.swap.assets,
    transactions: state.swap.transactions,
    link: state.swap.link,
    step: state.swap.step,
    fiatRate: state.swap.fiatRate,
  }
}

export default connect(
  mapStateToProps
)(SwapCompleted)
