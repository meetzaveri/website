import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useCookie, useLocation } from 'react-use';

import Button from 'components/shared/button';
import { HUBSPOT_NEWSLETTERS_FORM_ID } from 'constants/forms';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';

import CheckIcon from './images/subscription-form-check.inline.svg';
import ErrorIcon from './images/subscription-form-error.inline.svg';
import SendIcon from './images/subscription-form-send.inline.svg';

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const SubscriptionForm = ({ className }) => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState('default');
  const [errorMessage, setErrorMessage] = useState('');
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const handleInputChange = (event) => setEmail(event.currentTarget.value.trim());

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please enter a valid email');
    } else {
      setErrorMessage('');
      setFormState('loading');

      const loadingAnimationStartedTime = Date.now();

      sendHubspotFormData({
        formId: HUBSPOT_NEWSLETTERS_FORM_ID,
        context,
        values: [
          {
            name: 'email',
            value: email,
          },
        ],
      })
        .then((response) => {
          if (response.ok) {
            doNowOrAfterSomeTime(() => {
              setFormState('success');
              setEmail('Thanks for subscribing!');

              setTimeout(() => {
                setFormState('default');
                setEmail('');
              }, 2000);
            }, loadingAnimationStartedTime);
          } else {
            doNowOrAfterSomeTime(() => {
              setFormState('error');
              setErrorMessage('Something went wrong. Please reload the page and try again');
            }, loadingAnimationStartedTime);
          }
        })
        .catch(() => {
          doNowOrAfterSomeTime(() => {
            setFormState('error');
            setErrorMessage('Something went wrong. Please reload the page and try again');
          }, loadingAnimationStartedTime);
        });
    }
  };

  return (
    <form
      className={clsx(
        'relative ml-[14px] before:absolute before:-bottom-3.5 before:-left-3.5 before:h-full before:w-full before:rounded-full before:bg-secondary-2 2xl:ml-2.5 2xl:before:-bottom-2.5 2xl:before:-left-2.5 xl:ml-2 xl:before:-bottom-2 xl:before:-left-2 lg:mx-auto lg:max-w-[584px] md:before:w-[calc(100%+8px)]',
        className
      )}
      noValidate
      onSubmit={handleSubmit}
    >
      {/* Input */}
      <input
        className={clsx(
          'remove-autocomplete-styles t-2xl relative block h-24 w-[696px] rounded-full border-4 border-black bg-white pl-7 pr-[218px] font-semibold leading-none text-black placeholder-black outline-none transition-colors duration-200 3xl:w-[576px] 2xl:h-20 2xl:w-[478px] 2xl:pr-[187px] xl:h-[72px] xl:w-[448px] xl:pr-[164px] lg:w-full lg:pl-5 md:pr-20',
          errorMessage && 'border-secondary-1'
        )}
        name="email"
        type="email"
        placeholder="Your email..."
        autoComplete="email"
        value={email}
        readOnly={formState !== 'default'}
        onChange={handleInputChange}
      />

      {/* Error message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.span
            className="t-base absolute left-1/2 -bottom-5 w-full translate-y-full -translate-x-1/2 text-center font-semibold !leading-snug text-secondary-1 lg:-bottom-4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={appearAndExitAnimationVariants}
          >
            {errorMessage}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Button */}
      <AnimatePresence>
        {formState === 'default' && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={appearAndExitAnimationVariants}
          >
            <Button
              className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2 md:h-14 md:w-14 md:rounded-full md:p-0"
              size="sm"
              type="submit"
              theme="primary"
              disabled={formState !== 'default'}
            >
              <span className="md:sr-only">Subscribe</span>
              <SendIcon className="hidden md:ml-1.5 md:block" aria-hidden />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {formState === 'loading' && (
          <motion.div
            className="absolute right-3 top-1/2 flex h-[72px] w-[72px] -translate-y-1/2 items-center justify-center rounded-full bg-black 2xl:right-2.5 2xl:h-[60px] 2xl:w-[60px] xl:right-2 xl:h-[56px] xl:w-[56px]"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={appearAndExitAnimationVariants}
            aria-hidden
          >
            <div className="h-[58px] w-[58px] rounded-full border-[6px] border-gray-2 2xl:h-[48px] 2xl:w-[48px] xl:h-[42px] xl:w-[42px]" />
            <svg
              className="absolute top-1/2 left-1/2 2xl:h-[48px] 2xl:w-[48px] xl:h-[42px] xl:w-[42px]"
              width="58"
              height="58"
              viewBox="0 0 58 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
            >
              <motion.path
                d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
                strokeLinecap="round"
                stroke="#00e699"
                strokeWidth="6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success state */}
      <AnimatePresence>
        {(formState === 'success' || formState === 'error') && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={appearAndExitAnimationVariants}
            aria-hidden
          >
            {formState === 'success' && <CheckIcon className="2xl:w-[60px] xl:w-[56px]" />}
            {formState === 'error' && <ErrorIcon className="2xl:w-[60px] xl:w-[56px]" />}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

SubscriptionForm.propTypes = {
  className: PropTypes.string,
};

SubscriptionForm.defaultProps = {
  className: null,
};

export default SubscriptionForm;
