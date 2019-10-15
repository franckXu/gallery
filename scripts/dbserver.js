const axios = require("axios");
const fs = require("fs");

function fetchData(start) {
  console.log("start", start);
  return axios.get(
    `https://movie.douban.com/j/new_search_subjects?sort=U&range=0,10&tags=&start=${start}`,
    {
      credentials: "include",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      referrer: "https://movie.douban.com/tag/",
      referrerPolicy: "unsafe-url",
      body: null,
      // method: "GET",
      mode: "cors"
    }
  );
}

async function main() {
  try {
    let movies = [];
    for (let i = 0, len = 1000; i < len; i++) {
      const d = await fetchData(i * 20);
      movies = movies.concat(d.data.data);
    }

    console.log(movies.length);
    fs.writeFileSync("data.json", JSON.stringify(movies));
  } catch (err) {
    console.error(err);
  }

  // fetch(
  //   "https://movie.douban.com/j/new_search_subjects?sort=U&range=0,10&tags=&start=100",
  //   {
  //     credentials: "include",
  //     headers: {
  //       accept: "application/json, text/plain, */*",
  //       "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
  //       "sec-fetch-mode": "cors",
  //       "sec-fetch-site": "same-origin"
  //     },
  //     referrer: "https://movie.douban.com/tag/",
  //     referrerPolicy: "unsafe-url",
  //     body: null,
  //     method: "GET",
  //     mode: "cors"
  //   }
  // )
  //   .then(resp => resp.json())
  //   .then(
  //     resp => {
  //       console.log(resp);
  //     },
  //     err => console.log(err)
  //   )
  //   .catch(err => console.error(err));
}

main();
