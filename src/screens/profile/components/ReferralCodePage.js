import React from 'react';
import { View } from 'components/layout/View';
import { useSelector } from 'react-redux';
import { getReferralCode } from 'util/rehive';
import { copyToClipboard } from 'util/general';
import { useQuery } from 'react-query';
import { userProfileSelector } from 'redux/rehive/selectors';
import { currentCompanySelector } from 'redux/auth/selectors';
import { useToast } from 'components/contexts/ToastContext';
import Skeleton from '@material-ui/lab/Skeleton';
import NewIcon from 'components/outputs/NewIcon';
import IconButton from 'components/inputs/IconButton';
import Text from 'components/outputs/Text';
import CopyInput from 'components/outputs/CopyInput';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import PageContent from 'components/layout/page/PageContent';

export default function ReferralCodePage(props) {
  const company = useSelector(currentCompanySelector);
  const profile = useSelector(userProfileSelector);

  const { showToast } = useToast();

  const referralCodes = useQuery(
    ['referralCodes', profile?.items?.id],
    getReferralCode,
  );

  const code = referralCodes?.data?.data?.referral_code;

  return (
    <PageContent pt={3}>
      <View aI={'center'} w={'100%'} mb={1}>
        <PlaceholderImage name={'referral'} width={383} height={159} />
      </View>
      <Text
        bold
        style={{ fontSize: 21, textAlign: 'center' }}
        id="referral_prompt"
      />
      <View
        mt={2}
        mb={1}
        w={'100%'}
        fD={'row'}
        jC={'space-between'}
        aI={'center'}>
        {!code ? (
          <Skeleton width={'70%'} height={35} />
        ) : (
          <>
            <Text bold myColor={'primary'} style={{ fontSize: 18 }}>
              {code}
            </Text>
            <IconButton onClick={() => copyToClipboard(code, showToast)}>
              <NewIcon
                icon={'copy'}
                color={'primary'}
                size={20}
                inverted
                circled={false}
              />
            </IconButton>
          </>
        )}
      </View>
      <View>
        <View mb={1}>
          <Text bold id="how_does_it_work" />
        </View>
        <Text style={{ fontSize: 14 }} myColor={'grey4'} id="referral_how" />
      </View>
    </PageContent>
  );
}
