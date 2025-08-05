import { createSelector } from 'reselect';

export const cryptoStateSelector = state => state.crypto;

export const cryptoSelector = createSelector(
  cryptoStateSelector,
  cryptoState => cryptoState,
);
