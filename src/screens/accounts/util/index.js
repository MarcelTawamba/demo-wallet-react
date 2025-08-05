import base from 'util';

import * as accounts from './accounts';
import * as receive from './receive';
import * as transactions from './transactions';

const configs = { ...base, accounts, receive, transactions };

export default configs;
