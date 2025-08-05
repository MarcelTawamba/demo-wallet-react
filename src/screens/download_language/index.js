import Spinner from 'components/outputs/Spinner';
import React, { useEffect } from 'react';

export default function DownloadLanguagePage(props) {
  useEffect(() => {
    downloadLangJson();
  }, []);

  const downloadLangJson = () => {
    try {
      fetch('/language-en.json')
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'language-en.json';
          link.click();
          setTimeout(() => {
            window.close();
          }, 1000);
        })
        .catch(resError => console.log(resError));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ position: 'fixed', left: '50%', top: '50%' }}>
      <Spinner />
    </div>
  );
}
