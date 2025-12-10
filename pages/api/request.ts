const IMAGESAPI = 'https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/shotsdb.json';
const AUTHORSAPI = 'https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/authorsdb.json';
const axios = require('axios');
const timestamp = (new Date()).getTime();

export const getHofImages = () => axios.get(`${IMAGESAPI}?timestamp=${timestamp}`);
export const getHofAuthors = () => axios.get(`${AUTHORSAPI}?timestamp=${timestamp}`);
export const getSysImages = (year: number) => {
    switch(year) {
        case 2025: { 
          return axios.get(`sysdb2025.json?timestamp=${timestamp}`);
        }
        case 2024: { 
          return axios.get(`sysdb2024.json?timestamp=${timestamp}`);
        }
        case 2023: { 
          return axios.get(`sysdb2023.json?timestamp=${timestamp}`);
        }
        case 2022: { 
          return axios.get(`sysdb2022.json?timestamp=${timestamp}`);
        }
        case 2021: { 
          return axios.get(`sysdb2021.json?timestamp=${timestamp}`);
        } 
        default: { 
          return [];
        } 
     } 
}


//https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/authorsdb.json
