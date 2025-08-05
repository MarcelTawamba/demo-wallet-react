import { Machine, assign } from 'xstate';
import { concat } from 'lodash/fp';

// export interface DataSchema {
//   states: {
//     idle: {};
//     loading: {};
//     updating: {};
//     creating: {};
//     deleting: {};
//     success: {
//       states: {
//         unknown: {};
//         withData: {};
//         withoutData: {};
//       };
//     };
//     failure: {};
//   };
// }

// type SuccessEvent = { type: "SUCCESS"; results: any[]; pageData: object };
// type FailureEvent = { type: "FAILURE"; message: string };
// export type DataEvents =
//   | { type: "FETCH" }
//   | { type: "UPDATE" }
//   | { type: "CREATE" }
//   | { type: "DELETE" }
//   | SuccessEvent
//   | FailureEvent;

// export interface DataContext {
//   pageData?: object;
//   results?: any[];
//   message?: string;
// }

function log(context, event) {
  // console.log('log -> event', event);
  // console.log('log -> context', context);
}

export const dataMachine = machineId =>
  Machine(
    {
      id: machineId,
      initial: 'loading',
      context: {
        pageData: {},
        results: [],
        message: undefined,
      },
      states: {
        idle: {
          on: {
            FETCH: 'loading',
            CREATE: 'creating',
            UPDATE: 'updating',
            DELETE: 'deleting',
          },
        },
        loading: {
          entry: ['setLoading'],
          invoke: {
            src: 'fetchData',
            onDone: { target: 'success' },
            onError: { target: 'failure', actions: 'setMessage' },
          },
        },
        updating: {
          invoke: {
            src: 'updateData',
            onDone: { target: 'loading' },
            onError: { target: 'failure', actions: 'setMessage' },
          },
        },
        creating: {
          invoke: {
            src: 'createData',
            onDone: { target: 'loading' },
            onError: { target: 'failure', actions: 'setMessage' },
          },
        },
        deleting: {
          invoke: {
            src: 'deleteData',
            onDone: { target: 'loading' },
            onError: { target: 'failure', actions: 'setMessage' },
          },
        },
        success: {
          entry: ['setResults', log],
          on: {
            FETCH: 'loading',
            CREATE: 'creating',
            UPDATE: 'updating',
            DELETE: 'deleting',
          },
          initial: 'unknown',
          states: {
            unknown: {},
            always: [
              { target: 'withData', cond: 'hasData' },
              { target: 'withoutData' },
            ],
            withData: {},
            withoutData: {},
          },
        },
        failure: {
          entry: ['setMessage'],
          on: {
            FETCH: 'loading',
          },
        },
      },
    },
    {
      actions: {
        setResults: assign((ctx, event) => ({
          results: event?.data?.results
            ? event.data.results
            : event?.data
            ? event.data
            : ctx.results ?? [],
          loading: false,
        })),
        // setPageData: assign((ctx, event) => ({
        //   pageData: event.data.pageData,
        // })),

        setMessage: assign((ctx, event) => ({
          loading: false,
          message: event.message,
        })),
        setLoading: assign((ctx, event) => ({
          loading: event.payload ?? true,
        })),
      },
      guards: {
        hasData: (ctx, event) => !!ctx.results && ctx.results.length > 0,
      },
    },
  );
