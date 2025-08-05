import { View } from 'components/layout/View';
import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Ensure only numeric values are allowed
    if (!/^\d+$/.test(value)) {
      return;
    }

    // Update the OTP array
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Move focus to the next input field
    if (index < length - 1 && value !== '') {
      inputRefs.current[index + 1].focus();
    }

    // Check if all OTP fields are filled
    if (typeof onComplete === 'function' && !newOTP.includes('')) {
      onComplete(newOTP.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to move focus to the previous input
    if (e.key === 'Backspace') {
      const newOTP = [...otp];
      newOTP[index] = '';
      setOtp(newOTP);
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = e => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain');
    const pasteLength = Math.min(pasteData.length, length);
    const newOTP = [...otp];
    for (let i = 0; i < pasteLength; i++) {
      newOTP[i] = pasteData[i];
    }
    setOtp(newOTP);
    if (typeof onComplete === 'function' && !newOTP.includes('')) {
      onComplete(newOTP.join(''));
    }

    // Focus on the last input box
    inputRefs.current[length - 1].focus();
  };

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  return (
    <View fD="row" gap={1.5} mt={2}>
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={value}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={ref => (inputRefs.current[index] = ref)}
          style={{ height: 34, width: 38, fontSize: 16, textAlign: 'center' }}
        />
      ))}
    </View>
  );
};

export default OTPInput;
