import moment from 'moment';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { currentCompanySelector, authUserSelector } from 'redux/auth/selectors';
import { formatTime } from 'util/general';

export function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

export function useToggle(initialState = false) {
  const [value, setValue] = useState(initialState);

  function setFalse() {
    setValue(false);
  }

  function setTrue(value = true) {
    setValue(value);
  }

  return { value, setFalse, setTrue };
}

export function useModal(initialState = false) {
  const { value, setFalse, setTrue } = useToggle(initialState);

  return { modalVisible: value, hideModal: setFalse, showModal: setTrue };
}

export function useDismissed(id) {
  // const {
  //   context: { user, company },
  // } = useRehiveContext();

  const company = useSelector(currentCompanySelector);
  const user = useSelector(authUserSelector);

  const [dismissed, setDismissed] = useState({});
  const [loading, setLoading] = useState(true);

  // get user's dismissed data
  const companyDismissed = dismissed?.[company?.id] ?? {};
  const userDismissed = companyDismissed?.[user?.id] ?? {};

  // load dimissed value from async store
  async function load() {
    let tempDismissed = await localStorage.getItem('dismissed');
    setDismissed(tempDismissed ? JSON.parse(tempDismissed) : {});
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  // function to update dismissed
  async function dismiss(value = true) {
    if (id) {
      const newDismissed = {
        ...dismissed,
        [company?.id]: {
          ...companyDismissed,
          [user?.id]: { ...userDismissed, [id]: value },
        },
      };
      await setDismissed(newDismissed);
      await localStorage.setItem('dismissed', JSON.stringify(newDismissed));
    }
  }

  return {
    dismissed: id ? userDismissed?.[id] ?? false : dismissed,
    dismiss,
    loading,
  };
}

export function useTimer(length = 0) {
  const [expired, setExpired] = useState(false);
  const [remaining, setRemaining] = useState(parseInt(length));

  useEffect(() => {
    setRemaining(parseInt(length));
  }, [length]);

  useEffect(() => {
    let timer = null;
    async function startTimer() {
      timer = setTimeout(() => {
        if (remaining > 0) {
          setRemaining(remaining - 1);
        } else {
          setExpired(true);
          return () => clearTimeout(timer);
        }
        startTimer();
      }, 1000);
    }
    if (parseInt(length) === remaining) {
      startTimer();
    }
    return () => clearTimeout(timer);
  }, [length, remaining]);

  return { remaining, time: remaining, expired };
}

const useCountdown = targetDate => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime(),
  );

  useEffect(() => {
    setCountDown(countDownDate - new Date().getTime());
  }, [countDownDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = countDown => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export { useCountdown };
