import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Card from '@material-ui/core/Card';
import Image from 'components/outputs/Image';
import FormList from 'components/layouts/Page/FormList';
import IconButton from 'components/inputs/IconButton';
import { useSelector } from 'react-redux';
import { currentCompanySelector } from 'redux/auth/selectors';

export default function Content(props) {
  const { section = {}, item, pageId, screenId, history } = props;
  const company = useSelector(currentCompanySelector);
  let {
    id = pageId,
    title,
    titleId,
    image = id,
    description,
    parent,
  } = section;

  let { component: Component = FormList } = section;

  title = typeof title === 'function' ? title(props) : titleId || title;
  image = typeof image === 'function' ? image(props) : image;

  const showBack = screenId === 'settings' && typeof parent === 'string';

  function handleBack() {
    history.push('/' + screenId + '/' + (parent ? parent + '/' : ''));
  }
  const isRtl = document.dir === 'rtl';

  return (
    <View w="100%">
      <View
        mb={Boolean(image) ? 1.5 : 0}
        flex={1}
        fD={'row'}
        w="100%"
        aI="center">
        {Boolean(image) && (
          <View bR={100} {...{ [isRtl ? 'ml' : 'mr']: 1.5 }}>
            <Image
              src={image}
              width={section?.imageSize ?? 100}
              height={section?.imageSize ?? 100}
            />
          </View>
        )}
        <View>
          <Text
            id={title ?? id + '_title'}
            style={{ fontSize: 20, marginBottom: '0.5rem' }}
            bold
          />
          <Text
            id={description ?? id + '_description'}
            context={{ company: company?.name }}
            style={{
              fontSize: 15,
              color: '#797979',
              marginBottom: '1rem',
            }}
          />
        </View>
      </View>
      <Card p={1} style={{ boxShadow: 'none', width: '100%' }}>
        {showBack && (
          <View {...{ pt: 1, [isRtl ? 'pr' : 'pl']: 2 }}>
            <IconButton
              simple
              size={isRtl ? 20 : 13}
              color="action"
              icon={isRtl ? 'arrowright' : 'arrow_back_ios'}
              noPadding
              inverted
              onClick={handleBack}
            />
          </View>
        )}
        <Component noLayout {...props} item={item} values={item} />
      </Card>
    </View>
  );
}
