import React, { useState } from 'react';
import { Oval } from 'react-loader-spinner';
import './Popup.css';
import axios from 'axios';

const Popup = () => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  const url =
    'https://script.google.com/macros/s/<Appscript_path_here>/exec';

  const handlePush = async (payload) => {
    // POST request API payload

    try {
      await axios.post(url, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      setInfo('Parsed and Uploaded Successfully!');
      setLoading(false);
    } catch (err) {
      setInfo('Something went wrong');
      console.log(err);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();

    const sendMessage = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      if (tab.url.includes('www.upwork.com/ab/proposals/')) {
        // send message to scrape the website
        setLoading(true);
        e.target.disabled = true;
        setInfo('Please wait ...');

        const response = await chrome.tabs.sendMessage(tab.id, {
          status: 'start',
        });

        try {
          await handlePush(response.payload);
        } catch (err) {
          console.log(err);
        }

        e.target.disabled = false;
      } else {
        // cannot scrape since not on upwork website
        setInfo('No proposal data found! Please visit correct url');
        setTimeout(() => {
          setInfo('');
        }, 3000);
      }
    };
    sendMessage();
  };

  return (
    <div className="container">
      <div className="container__head">
        parser for <span style={{ color: '#11a683' }}>&nbsp;Upwork</span>
      </div>
      <div className="container__status">{info}</div>
      <button className="container__btn" onClick={handleClick}>
        {loading ? (
          <Oval
            height={20}
            width={20}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        ) : (
          'Start Parsing'
        )}
      </button>
    </div>
  );
};

export default Popup;
