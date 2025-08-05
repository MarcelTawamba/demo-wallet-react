import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { getUserLocales, updateProfile } from 'util/rehive';
import Spinner from 'components/outputs/Spinner';
import PageContent from 'components/layout/page/PageContent';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { changeLanguage } from 'i18next';
import i18n from 'util/i18n';
import { updateUserProfile } from 'redux/auth/actions';
import { fetchData } from 'redux/rehive/actions';

export default function LanguageSettings({ dispatch }) {
  const appLanguage = i18n.language;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(appLanguage);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const resp = await getUserLocales();
      let _data = _.get(resp, ['results'], []);
      if (_data?.length === 0)
        // setting default
        _data = [
          {
            id: 'en',
            name: 'English',
            translation: {},
          },
        ];
      setData(_data);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function setUserLanguage(langId) {
    setLoading(true);
    const resp = await updateProfile({ language: langId });
    setLanguage(langId);
    changeLanguage(langId);
    setLoading(false);
    dispatch(updateUserProfile(resp?.data ?? resp));
    dispatch(fetchData('profile'));
  }

  return (
    <PageContent>
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          {data.map(item => (
            <LanguageItem
              item={item}
              language={language}
              setUserLanguage={setUserLanguage}
            />
          ))}
        </React.Fragment>
      )}
    </PageContent>
  );
}

function LanguageItem({ item, language, setUserLanguage }) {
  const { id, name } = item;

  return (
    <View>
      <Button
        onClick={() => setUserLanguage(id)}
        color={language === id ? 'primary' : ''}
        variant="text">
        {name}
      </Button>
    </View>
  );
}
