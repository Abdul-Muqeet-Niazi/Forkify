import { TIME_OUT } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // getting the JSON data
    const response = await Promise.race([fetch(url), timeout(TIME_OUT)]);
    const data = await response.json();

    // Manual Throw Errors
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (error) {
    // Re-Throwing the error of loadRecipe on model.js
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // Sending the data(uploaded-one parameter) to the API(url parameter) as JSON format.
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const response = await Promise.race([fetchPromise, timeout(TIME_OUT)]);
    const data = await response.json();

    // Manual Throw Errors
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (error) {
    // Re-Throwing the error of loadRecipe on model.js
    throw error;
  }
};
