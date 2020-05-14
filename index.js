const fetch = require("node-fetch");
const csv = require("csv-parser");
const fastcsv = require("fast-csv");
const fs = require("fs");
const dotenv = require("dotenv");
const ws = fs.createWriteStream("out.csv");
cities = [];
dotenv.config();
const key = process.env.KEY;
function getlatlng(q) {
  let url =
    "http://open.mapquestapi.com/geocoding/v1/address?key=" +
    key +
    "&location=" +
    q;
  let settings = { method: "GET" };
  return fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      return {
        lat: json["results"][0]["locations"][0]["latLng"]["lat"],
        long: json["results"][0]["locations"][0]["latLng"]["lng"],
      };
    });
}
// cities = [];
latlongs = [];
async function leggo(cities, num) {
  for (let i = 0; i < num; i++) {
    x = await getlatlng(cities[i]["city"]);
    await latlongs.push(x);
    latlongs[i]["city"] = cities[i]["city"];
    console.log(cities[i]["city"], x);
  }
  await console.log(latlongs);
  await fastcsv.write(latlongs, { headers: true }).pipe(ws);
  //   await cities.push(x);
  //   await console.log(cities);
  //   await console.log(x);
}
// cities.push(getlatlng("Gurgaon"));
// citites.push(getlatlng("Assam"));

// setTimeout(function () {
//   fastcsv.write(cities, { headers: false }).pipe(ws);
// }, 10000);
// leggo();
fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    cities.push({ city: row["city"] });
    // console.log(row["city"]);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    // console.log("List of cities:", cities);
    leggo(cities, 10);
    // for (let i = 0; i < 10; i++) {
    //   console.log(cities[i]);
    // }
    // fastcsv.write(cities, { headers: false }).pipe(ws);
  });
