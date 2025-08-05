import { useTranslation } from 'react-i18next';

export default function useI18Language() {
  const { t } = useTranslation(['common']);

  const getI18Translation = (key, context = {}) => {
    const translatedText = typeof key === 'string' ? t(key, context) : key;
    return translatedText;
  };

  return { getI18Translation };
}
