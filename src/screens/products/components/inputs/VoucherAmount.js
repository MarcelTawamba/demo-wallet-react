import React, { useState } from 'react';

import { AccordionList } from 'accordion-collapse-react-native';
import { Text, View, Button } from 'components';
import { Icon } from 'components/outputs/Icon';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import { FlatList } from 'react-native';
import { groupBy, get } from 'lodash';
import {
  objectToArray,
  formatDivisibility,
  getCurrencyCode,
} from 'util/general';

export default function VoucherAmount(props) {
  const { formikProps, providers } = props;
  const { values } = formikProps;
  const { type, provider, bundle } = values;
  const [modalVisible, setModalVisible] = useState(false);
  if (!provider && (!providers || !providers.length)) {
    return null;
  }

  const temp = provider ? provider : get(providers, 0, {});
  if (!temp) {
    return null;
  }

  const { variants } = temp;
  const showBundles = Boolean(variants.length > 0);

  return (
    <View ph={1}>
      <View fD="row" p={0.5}>
        <Text>Amount</Text>
        <View
          h="60%"
          f={1}
          style={{
            marginLeft: 12,
            borderBottomWidth: 2,
            borderBottomColor: '#EFEFEF',
          }}
        />
      </View>
      {showBundles && (
        <Button onPress={() => setModalVisible(true)}>
          <View
            p={0.5}
            h={51}
            style={{
              borderWidth: 1,
              borderColor: 'lightgray',
              margin: 8,
              borderRadius: 5,
              flexDirection: 'row',
              paddingHorizontal: 12,
            }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text>
                {bundle
                  ? bundle.label
                    ? bundle.label
                    : bundle.code
                  : 'Choose bundle'}
              </Text>
            </View>

            <Icon
              style={{ paddingTop: 4 }}
              name={'chevron-right'}
              size={24}
              set={'MaterialCommunityIcons'}
              color={'font'}
            />
          </View>
        </Button>
      )}
      <View p={1} ph={0.125}>
        <Button
          {...{
            label: 'NEXT',
            wide: true,
            loading: formikProps.isSubmitting,
            disabled:
              formikProps.isSubmitting || !formikProps.isValid || !bundle,
            onPress: () => formikProps.setStatus({ scene: 'confirm' }),
          }}
        />
      </View>
      <ModalFullscreen
        close
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}>
        <BundleList
          providers={providers}
          variants={variants}
          formikProps={formikProps}
          onSuccess={() => setModalVisible(false)}
        />
      </ModalFullscreen>
    </View>
  );
}

function BundleList(props) {
  const { formikProps, onSuccess, providers } = props;
  const { setFieldValue, values, setFieldTouched } = formikProps;
  const { type, provider } = values;
  const [bundleType, setBundleType] = useState(0);

  const { variants, options } = provider ? provider : get(providers, 0, {});

  const showBundlesByType = Boolean(options.length > 1);
  let frequencyOption = null;
  let groupedVariants = {};
  if (showBundlesByType) {
    frequencyOption = options.find(item => item.name === 'Frequency');
    if (!frequencyOption) {
      frequencyOption = options[1];
    }

    groupedVariants = groupBy(variants, item =>
      get(item, ['options', frequencyOption.name]),
    );
  }

  return (
    <View>
      {showBundlesByType ? (
        <AccordionList
          expandedIndex={0}
          onToggle={index => setBundleType(bundleType === index ? null : index)}
          list={objectToArray(groupedVariants, 'label', 'data')}
          header={(item, index) => (
            <BundleListHeader label={item.label} open={bundleType === index} />
          )}
          body={item => (
            <BundleListDetail
              data={item.data}
              formikProps={formikProps}
              onSuccess={onSuccess}
            />
          )}
        />
      ) : (
        <View>
          <View fD="row" p={0.5}>
            <Text>Select bundle</Text>
            <View
              h="60%"
              f={1}
              style={{
                marginLeft: 12,
                borderBottomWidth: 2,
                borderBottomColor: '#EFEFEF',
              }}
            />
          </View>
          <BundleListDetail
            formikProps={formikProps}
            data={variants}
            onSuccess={onSuccess}
          />
        </View>
      )}
    </View>
  );
}

function BundleListHeader(props) {
  const { label, open } = props;

  return (
    <View fD="row" p={0.5} jCs="center">
      <Text>{label}</Text>
      <View
        h="45%"
        f={1}
        style={{
          marginLeft: 12,
          marginRight: 4,
          borderBottomWidth: 2,
          borderBottomColor: '#EFEFEF',
        }}
      />
      <Icon
        name={'chevron-' + (open ? 'up' : 'down')}
        size={24}
        set={'MaterialCommunityIcons'}
        color={'font'}
      />
    </View>
  );
}

function BundleListDetail(props) {
  const { formikProps, data, onSuccess } = props;
  const { setFieldValue, values, setFieldTouched } = formikProps;
  const { currency } = values;

  return (
    <FlatList
      style={{ paddingBottom: 16 }}
      data={data}
      renderItem={({ item }) => (
        <Button
          onPress={() => {
            setFieldValue(
              'amount',
              formatDivisibility(
                get(item, ['prices', 0]),
                currency.currency.divisibility,
              ),
            );
            setFieldValue('bundle', item);
            onSuccess();
          }}
          key={item.code}>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'lightgray',
              margin: 8,
              borderRadius: 5,
              flexDirection: 'row',
              paddingRight: 12,
            }}>
            <View f={1} p={0.5}>
              <Text>{item.label ? item.label : getCurrencyCode(item)}</Text>
            </View>

            <Icon
              style={{ paddingTop: 4 }}
              name={'chevron-right'}
              size={24}
              set={'MaterialCommunityIcons'}
              color={'font'}
            />
          </View>
        </Button>
      )}
      keyExtractor={item => item.code}
    />
  );
}
