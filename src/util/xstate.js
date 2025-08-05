import { Machine, assign } from 'xstate';

export const FETCH = 'FETCH';

// const IDLE = 'idle'

function useFetchMachine(config, search) {
  const { id } = config;

  const machine = Machine(
    {
      id: 'fetch.' + id,
      initial: 'loading',
      context: {
        search,
        data: undefined,
        error: undefined,
      },
      states: {
        idle: {
          on: { [FETCH]: 'loading' }, // EDIT: 'edit', VIEW: 'view' },
        },
        loading: {
          invoke: {
            src: 'fetchData',
            onDone: {
              target: 'idle',
              actions: 'onDone',
            },
            onError: {
              target: 'idle',
              actions: 'onError',
            },
          },
        },
        // edit: {
        //   on: {
        //     IDLE: 'idle',
        //     VIEW: 'view',
        //     BACK: {
        //       id: 'view',
        //       actions: ['clearFilters'],
        //     },
        //   },
        // },
        // view: {
        //   on: { IDLE: 'idle', EDIT: 'edit', BACK: 'idle' },
        // },
        success: {
          entry: 'notifySuccess',
          type: 'final',
        },
        failure: {
          on: {
            RETRY: 'loading',
          },
        },
      },
    },
    {
      actions: {
        // clearFilters: (context, event) => {
        //   push(machineId);
        // },
        onError: assign({
          error: (_, event) => event.data,
        }),
        onDone: assign({
          data: (_, event) => event.data,
          error: '',
        }),
      },
    },
  );
  return { machine };
}

const actions = { FETCH };

export { useFetchMachine, actions };
