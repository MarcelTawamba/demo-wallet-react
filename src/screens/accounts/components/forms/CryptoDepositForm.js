import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import QR from 'components/outputs/QR';
import OutputList from 'components/lists/OutputList';
import { callApi, getBridgeCryptoDepositAddress } from 'util/rehive';
import { View } from 'components/layout/View';
import Spinner from 'components/outputs/Spinner';
import Info from 'components/outputs/Info';
import { SimpleImg } from 'react-simple-img';
import Skeleton from '@material-ui/lab/Skeleton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useBridgeCryptoDepositAddress } from 'hooks/bridgeAPI';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  qr: {
    width: '100%',
    height: 250,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    maxWidth: '100%',
  },
  details: {
    padding: theme.spacing(2),
    width: '100%',
    boxSizing: 'border-box',
  },
  qrSkeleton: {
    width: 260,
    height: 260,
    borderRadius: 8,
    maxWidth: '100%',
  },
  chainSelector: {
    width: '100%',
    maxWidth: 600,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    boxSizing: 'border-box',
  },
  profileSection: {
    marginBottom: theme.spacing(3),
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outputListContainer: {
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 600,
    boxSizing: 'border-box',
    marginBottom: theme.spacing(3),
  },
  contentContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  infoContainer: {
    paddingTop: 32,
    marginBottom: theme.spacing(2),
    width: '100%',
    boxSizing: 'border-box',
    wordBreak: 'break-word',
  }
}));

const CHAIN_OPTIONS = [
  { value: 'solana', labelKey: 'network_solana' },
  { value: 'arbitrum', labelKey: 'network_arbitrum' },
  { value: 'base', labelKey: 'network_base' },
  { value: 'ethereum', labelKey: 'network_ethereum' },
  { value: 'optimism', labelKey: 'network_optimism' },
  { value: 'polygon', labelKey: 'network_polygon' },
  { value: 'stellar', labelKey: 'network_stellar' }
];

export default function CryptoDepositForm(props) {
  const classes = useStyles();
  const { showToast, currency: accountCurrency, profile } = props;
  const [selectedChain, setSelectedChain] = useState('solana');
  const { t } = useTranslation(['common']);

  const { items } = profile || {};
  const { first_name, last_name, profile: profileImage } = items || {};

  const { 
    data, 
    isLoading, 
    error: queryError,
    refetch
  } = useBridgeCryptoDepositAddress(
    "usdc", // Hardcoded for now
    accountCurrency.id,
    selectedChain
  );

  const depositAddress = data?.data?.address || '';
  const depositMemo = data?.data?.memo || '';
  const error = queryError ? t('crypto_deposit_fetch_error') : null;

  const outputItems = [
    {
      label: t('address_label'),
      value: depositAddress,
      copy: true,
      onCopy: () => showToast(t('crypto_deposit_address_copied'), 'success'),
    },
  ];

  if (depositMemo) {
    outputItems.push({
      label: t('memo_label'),
      value: depositMemo,
      copy: true,
      onCopy: () => showToast(t('crypto_deposit_memo_copied'), 'success'),
    });
  }

  return (
    <React.Fragment>
      <PageContent footer style={{ overflowX: 'hidden', overflowY: 'auto' }}>
        <Box className={classes.container}>
          {isLoading ? (
            <div className={classes.contentContainer}>
              <div className={classes.profileSection}>
                <View
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 120,
                    marginLeft: 24,
                    marginRight: 24,
                    marginBottom: 24,
                    marginTop: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {Boolean(profileImage) ? (
                    <SimpleImg
                      style={{
                        maxHeight: 120,
                        maxWidth: 120,
                        borderRadius: 120,
                      }}
                      imgStyle={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      alt="profile"
                      src={profileImage}
                    />
                  ) : (
                    <AccountCircleIcon
                      style={{ 
                        fontSize: 120, 
                        color: '#E0E0E0' 
                      }}
                    />
                  )}
                </View>
                
                {(first_name || last_name) && (
                  <Text variant="h6" align={'center'} bold>
                    {[first_name, last_name].filter(Boolean).join(' ')}
                  </Text>
                )}
              </div>
              
              <Box className={classes.chainSelector}>
                <Skeleton variant="rect" height={56} width="100%" />
              </Box>
              
              <View aI={'center'} w={'100%'} pb={2} className={classes.qr}>
                <Skeleton variant="rect" className={classes.qrSkeleton} />
              </View>

              <View className={classes.outputListContainer}>
                <Skeleton variant="rect" height={80} width="100%" />
              </View>
              
              <View h={32} />

              <View className={classes.infoContainer}>
                <Skeleton variant="rect" height={100} width="100%" />
              </View>
            </div>
          ) : error ? (
            <View p={4} fD="column" aI="center" jC="center">
              <Text color="error">{error}</Text>
            </View>
          ) : (
            <div className={classes.contentContainer}>
              <div className={classes.profileSection}>
                <View
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 120,
                    marginLeft: 24,
                    marginRight: 24,
                    marginBottom: 24,
                    marginTop: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {Boolean(profileImage) ? (
                    <SimpleImg
                      style={{
                        maxHeight: 120,
                        maxWidth: 120,
                        borderRadius: 120,
                      }}
                      imgStyle={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      alt="profile"
                      src={profileImage}
                    />
                  ) : (
                    <AccountCircleIcon
                      style={{ 
                        fontSize: 120, 
                        color: '#E0E0E0' 
                      }}
                    />
                  )}
                </View>
                
                {(first_name || last_name) && (
                  <Text variant="h6" align={'center'} bold>
                    {[first_name, last_name].filter(Boolean).join(' ')}
                  </Text>
                )}
              </div>

              <FormControl className={classes.chainSelector}>
                <InputLabel>{t('crypto_deposit_select_network_label')}</InputLabel>
                <Select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                >
                  {CHAIN_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <View aI={'center'} w={'100%'} pb={2} className={classes.qr}>
                <QR showToast={showToast}>{depositAddress}</QR>
              </View>

              <View className={classes.outputListContainer}>
                <OutputList
                  items={outputItems}
                  outputProps={{
                    align: 'left',
                  }}
                />
              </View>
              
              <View h={32} />

              <View className={classes.infoContainer}>
                <Info noMargin variant="warning">
                  {t('crypto_deposit_warning_message', { 
                    network: t(CHAIN_OPTIONS.find(chain => chain.value === selectedChain)?.labelKey ?? ''), 
                    token: 'USDC' // Assuming USDC for now, might need dynamic token later
                  })}
                  {depositMemo && (
                    <div>
                      <br></br>
                      {t('crypto_deposit_memo_warning_message')}
                    </div>
                  )}
                </Info>
              </View>
            </div>
          )}
        </Box>
      </PageContent>
    </React.Fragment>
  );
} 