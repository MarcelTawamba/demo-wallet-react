
import config from './config'
import components from './components'
import pages from './pages'
import util from './util'

const exportConfigs = {
  title: 'Accounts',
  subtitle: 'All things related to accounts, currencies, balances and currency flows',
  description: `This screen has the primary function of listing the user's account and currency balances. It also handles all flows of funds such as sending, receiving, transferring, exchanging, etc`,
  features: {
    list: {
      title: 'Account list',
      type: '',
      description: 'Lists the users accounts - Link to component',
    },
    pages: {
      title: 'Account pages and flows',
      type: '',
      description: 'List transactions, send, receive, transfer flows, routing etc',
    },
    balance: {
      title: 'Account balance',
      type: '',
      description: 'Lists the users account balance',
    }
  },
  children: components,
  config,
  util ,
}

export default exportConfigs;