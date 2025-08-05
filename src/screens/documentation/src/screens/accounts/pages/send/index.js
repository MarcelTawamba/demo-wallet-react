const exportConfigs = {
  title: 'Send',
  description: 'Page for sending currencies',
  layout: 'form',
  features: {
    form: {
      title: 'Send form',
      inputs: [{id: 'amount'}, {id:'recipientType'}, {id:'recipient'}, {id:'memo'}, {id:'note'}],
    },
    help: {
      title: 'Send help',
      description: 'When on stellar crypto send show option to display additional help'
    }
  }
}

export default exportConfigs;