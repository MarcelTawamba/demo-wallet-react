import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { getPublicCompanyGroups } from 'util/rehive';
import { shiftToStart } from 'util/general';
import { trackFlow } from 'util/tracking';
import Spinner from 'components/outputs/Spinner';
import GroupSelector from './GroupSelector';
import ButtonList from 'components/lists/ButtonList';
import IconLabelButton from 'components/inputs/IconLabelButton';
import Box from '@material-ui/core/Box';

const GroupPage = props => {
  const { onSuccess, company, authConfig, setTempAuth, tempAuth, onBack } =
    props;
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(groups[0]);

  function updateGroup(newGroup) {
    trackFlow('register', 'group selection', ['group'], 'clicked', {
      group: newGroup?.name?.toLowerCase(),
    });
    setGroup(newGroup);
    setTempAuth({ ...tempAuth, group: newGroup });
  }

  // const queryGroups = useQuery(
  //   ['publicCompanies'],
  //   ()=>getPublicCompanyGroups(company.id, true),
  // );

  // const groups =useMemo(
  //  ()=>shiftToStart( queryGroups?.data?.results, 'default', true),
  //   [queryGroups?.data],
  // );

  useEffect(() => {
    async function handleGetGroups() {
      const response = await getPublicCompanyGroups(company.id);
      if (response && response.status === 'success') {
        const results = get(response, ['data', 'results']);
        const sorted = shiftToStart(results, 'default', true);
        setGroups(sorted);

        const defaultGroup = get(sorted, [0], null);
        updateGroup(defaultGroup);

        if (results && results.length === 1) {
          setTempAuth({ ...tempAuth, noGroups: true });
          onSuccess();
        } else {
          setLoading(false);
        }
      } else {
        //TODO: handle error? Toast plus back?
      }
    }
    if (authConfig.group) {
      handleGetGroups();
    } else {
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authConfig.group, company.id]);

  const groupSelectorProps = {
    item: group,
    setItem: updateGroup,
    items: groups,
    onSuccess,
  };

  const buttons = [
    {
      id: 'continue',
      onPress: () => {
        onSuccess();
      },
      capitalize: true,
    },
    {
      id: 'back',
      variant: 'text',
      onPress: () => onBack(),
    },
  ];

  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <IconLabelButton label="back" onPress={onBack} show />
          <Box p={1} width="100%" />
          <GroupSelector {...groupSelectorProps} />
          {groups.length > 4 ? (
            <ButtonList layout="vertical" items={buttons} />
          ) : null}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default GroupPage;
