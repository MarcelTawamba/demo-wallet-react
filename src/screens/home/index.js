import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, uniq, intersection } from 'lodash';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import AnnouncementCard from './components/AnnouncementCard';
import PostCard from './components/PostCard';
import Alert from 'components/outputs/Alert';
import PromptSection from './components/PromptSection';
import FeaturedSection from './components/FeaturedSection';
import CombinedTransactions from './components/CombinedTransactions';
import FeaturedProductCard from './components/FeaturedProductCard';
import FeaturedRewardCard from './components/FeaturedRewardCard';
import HelpCard from './components/HelpCard';
import GetStartedCard from './components/GetStartedCard';
import {
  configCardsStateSelector,
  userProfileSelector,
} from 'redux/rehive/selectors';
import {
  currentCompanyServicesSelector,
  currentCompanySelector,
} from 'redux/auth/selectors';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { getProducts, getCampaigns } from 'util/rehive';
import Image from './components/images';
import { getUserGroup } from 'util/general';
import { checkBusinessGroup } from 'util/business';
import WelcomeCard from './components/WelcomeCard';
import { useDismissed } from 'hooks/general';
import { useRehiveContext } from 'contexts';
import { useDocumentsFetch } from 'hooks/documentAPI';
import AccountBalanceGrid from './components/AccountBalanceGrid';

export default function HomeContainer(props) {
  const { history, businessServiceSettings } = props;
  const [dismissed, setDismissed] = useState(true);
  const [loading, setLoading] = useState(true);

  const cardsConfig = useSelector(configCardsStateSelector);
  const wallets = useSelector(walletsSelector);
  const services = useSelector(currentCompanyServicesSelector);
  const company = useSelector(currentCompanySelector);
  const profile = useSelector(userProfileSelector);
  const { config } = useRehiveContext();
  const user = profile?.items;
  const userGroup = getUserGroup(user);

  const {
    dismissed: isGetStartedDismissed,
    loading: getStartedDismissLoading,
  } = useDismissed('homepage_get_started');

  const { data: { results: userDocuments = [] } = {} } = useDocumentsFetch(
    user?.id,
  );

  const hasPendingDoc = useMemo(
    () => userDocuments?.findIndex(item => item.status === 'pending') !== -1,
    [userDocuments],
  );

  useEffect(() => {
    loadDismissed();
  }, []);

  useEffect(() => {
    if (!loading) localStorage.setItem('dismissed', JSON.stringify(dismissed));
  }, [dismissed]);

  async function loadDismissed() {
    let tempDismissed = localStorage.getItem('dismissed');

    setDismissed(tempDismissed ? JSON.parse(tempDismissed) : {});
    setLoading(false);
  }
  const isBusinessGroup = useMemo(
    () => checkBusinessGroup(businessServiceSettings, userGroup),
    [businessServiceSettings, userGroup],
  );

  function onDismiss({ section, id }) {
    let temp = {
      ...dismissed,
      [company?.id]: {
        ...dismissed?.[company?.id],
        [user?.id]: {
          ...dismissed?.[company?.id]?.[user?.id],
          [section]: uniq([
            ...(dismissed?.[company?.id]?.[user?.id]?.[section] ?? []),
            id,
          ]),
        },
      },
    };

    setDismissed(temp);
  }

  const isDismissed = ({ section, id }) => {
    return (
      dismissed?.[company?.id]?.[user?.id]?.[section]?.includes(id) ?? false
    );
  };

  function renderAnnouncement() {
    let announcements =
      [cardsConfig?.home?.main?.announcement ?? {}].filter(
        x =>
          !isEmpty(x) &&
          (!x.startDate || moment(x.startDate) < moment()) &&
          (!x.endDate || moment(x.endDate) >= moment()),
      ) ?? [];

    if (!announcements.length) return <WelcomeCard company={company} />;
    announcements = announcements.filter(
      x => !isDismissed({ section: 'announcements', id: x.id }),
    );

    return (
      <Grid item xs={12}>
        {announcements?.map(item => (
          <Grid item xs={12} key={item.id}>
            <AnnouncementCard
              {...item}
              handleDismiss={
                item.dismissible
                  ? () => onDismiss({ section: 'announcements', id: item?.id })
                  : null
              }
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  function renderAlerts() {
    const alerts =
      cardsConfig?.home?.main?.alerts?.filter(
        x =>
          (!x.startDate || moment(x.startDate) < moment()) &&
          (!x.endDate || moment(x.endDate) >= moment()) &&
          (!x.groups?.length ||
            intersection(x.groups ?? [], user?.groups?.map(x => x.name) ?? [])
              ?.length) &&
          !isDismissed({ section: 'alerts', id: x.id }),
      ) ?? [];

    return (
      <Grid item xs={12}>
        <View mb={1}>
          <Text id="alerts" fontWeight={500} s={18} />
        </View>
        {!alerts?.length ? (
          <View aI={'center'}>
            <Image name={'alertPlaceholder'} size={50} />
            <Text
              id="no_alerts"
              style={{ textAlign: 'center', fontSize: 14 }}
            />
          </View>
        ) : (
          alerts?.map(item => (
            <View mb={1} key={item.id}>
              <Alert
                {...item}
                onPress={
                  item.dismissible
                    ? () => onDismiss({ section: 'alerts', id: item?.id })
                    : null
                }
              />
            </View>
          ))
        )}
      </Grid>
    );
  }

  const hideGetStartedCard = useMemo(() => {
    return cardsConfig?.home?.getStarted?.hide;
  }, [cardsConfig]);

  function renderPrompts() {
    let prompts = [];
    
    // 1. CONFIGURED PROMPTS - From company configuration
    // These are admin-configured prompts with specific targeting
    let filteredPrompts =
      cardsConfig?.home?.main?.prompts?.filter(
        x =>
          // Date range filtering
          (!x.startDate || moment(x.startDate) < moment()) &&
          (!x.endDate || moment(x.endDate) >= moment()) &&
          // Exclude scan actions
          x.action !== 'scan' &&
          // User group targeting (if specified)
          (!x.groups?.length ||
            intersection(x.groups ?? [], user?.groups?.map(x => x.name) ?? [])
              ?.length),
      ) ?? [];
    prompts = prompts.concat(filteredPrompts);
    
    // 2. DOCUMENTS PENDING PROMPT - Urgent document review needed
    // Appears when: user has documents with status === 'pending'
    if (hasPendingDoc)
      prompts.push({
        title: 'documents_pending',
        description: 'documents_pending_subtitle',
        variant: 'document', // Links to /profile/documents/
      });
    
    // DISMISSAL FILTERING - Remove user-dismissed prompts
    // Users can dismiss prompts, stored in localStorage by company+user+section+id
    prompts = prompts.filter(
      x => !isDismissed({ section: 'prompts', id: x.id }),
    );
    if (!prompts.length) return null;

    return (
      <Grid item xs={12}>
        <PromptSection
          {...{
            prompts,
            wallets,
            history,
            profile,
            handleDismiss: onDismiss,
            company,
          }}
        />
      </Grid>
    );
  }

  function renderFeatured({ section }) {
    let featuredProps;

    switch (section) {
      case 'products':
      default:
        featuredProps = {
          dataFunction: () => getProducts('?page_size=3'),
          renderItem: item => (
            <Grid item xs={12} sm={4} key={item.key}>
              <FeaturedProductCard {...item} history={history} />
            </Grid>
          ),
          redirect: () => history.push('/products/'),
        };
        break;
      case 'rewards':
        featuredProps = {
          dataFunction: () => getCampaigns('available=true&page_size=4'),
          itemCount: 4,
          renderItem: item => (
            <Grid item xs={6} sm={3} key={item.key}>
              <FeaturedRewardCard {...item} history={history} />
            </Grid>
          ),
          redirect: () => history.push('/rewards/'),
        };
        break;
    }

    return (
      <FeaturedSection
        key={`featured_${section}`}
        {...{
          history,
          company,
          section,
          id: `featured_${section}`,
          ...featuredProps,
        }}
      />
    );
  }

  function renderTransactions() {
    return (
      <Grid item xs={12}>
        <View mb={1}>
          <Text id="transactions" fontWeight={500} s={18} />
        </View>
        <CombinedTransactions {...{ history, wallets }} />
      </Grid>
    );
  }

  function renderNews() {
    const announcements =
      [cardsConfig?.home?.feed?.announcement ?? {}].filter(
        x =>
          !isEmpty(x) &&
          (!x.startDate || moment(x.startDate) < moment()) &&
          (!x.endDate || moment(x.endDate) >= moment()) &&
          (!x.groups?.length ||
            intersection(x.groups ?? [], user?.groups?.map(x => x.name) ?? [])
              ?.length) &&
          !isDismissed({ section: 'announcements', id: x.id }),
      ) ?? [];

    const posts =
      cardsConfig?.home?.feed?.posts
        ?.filter(
          x =>
            (!x.startDate || moment(x.startDate) < moment()) &&
            (!x.endDate || moment(x.endDate) >= moment()) &&
            (!x.groups?.length ||
              intersection(x.groups ?? [], user?.groups?.map(x => x.name) ?? [])
                ?.length) &&
            !isDismissed({ section: 'posts', id: x.id }),
        )
        ?.reverse() ?? [];

    if (!announcements.length && !posts.length) return null;

    return (
      <Grid item xs={12}>
        <View mb={1}>
          <Text id="posts" fontWeight={500} s={18} />
        </View>
        <Grid container spacing={3}>
          {announcements?.map(item => (
            <Grid item xs={12} key={item.id}>
              <AnnouncementCard
                {...item}
                handleDismiss={
                  item.dismissible
                    ? () =>
                        onDismiss({ section: 'announcements', id: item?.id })
                    : null
                }
              />
            </Grid>
          ))}
          {posts?.map(item => (
            <Grid item xs={12} sm={6} key={item.id}>
              <PostCard
                {...item}
                handleDismiss={
                  item.dismissible
                    ? () => onDismiss({ section: 'posts', id: item?.id })
                    : null
                }
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={4} style={{ maxWidth: '100vw' }}>
      <Grid item xs={12} lg={8}>
        <Grid container spacing={2}>
          {renderAnnouncement()}
          <Grid item xs={12}>
            <AccountBalanceGrid />
          </Grid>
          <Hidden lgUp>
            {renderAlerts()}
            {renderPrompts()}
          </Hidden>
          {!hideGetStartedCard &&
            !getStartedDismissLoading &&
            !isGetStartedDismissed && (
              <GetStartedCard
                userId={user?.id}
                company={company}
                wallets={wallets}
                services={services}
                cardsConfig={cardsConfig}
                businessServiceSettings={businessServiceSettings}
                isBusinessGroup={isBusinessGroup}
              />
            )}
          {renderNews()}
          {services?.product_service &&
            !(cardsConfig?.home?.main?.featured?.hideProducts?.length
              ? cardsConfig?.home?.main?.featured?.hideProducts?.includes(
                  userGroup,
                )
              : cardsConfig?.home?.main?.featured?.hideProducts) &&
            renderFeatured({ section: 'products' })}
          {services?.rewards_service &&
            !(cardsConfig?.home?.main?.featured?.hideRewards?.length
              ? cardsConfig?.home?.main?.featured?.hideRewards?.includes(
                  userGroup,
                )
              : cardsConfig?.home?.main?.featured?.hideRewards) &&
            renderFeatured({ section: 'rewards' })}
          {renderTransactions()}
          <HelpCard />
        </Grid>
      </Grid>
      <Hidden mdDown>
        <Grid item xs={4}>
          <Grid container spacing={1}>
            {renderAlerts()}
            {renderPrompts()}
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
  );
}
