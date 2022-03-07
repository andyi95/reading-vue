 'use strict';
const bizSdk = require('facebook-nodejs-business-sdk');


// eslint-disable-next-line no-unused-vars
const access_token = process.env.GRAPH_ACCESS_TOKEN;
 // eslint-disable-next-line no-unused-vars
const app_secret = process.env.GRAPH_APP_SECRET;
 // eslint-disable-next-line no-unused-vars
const app_id = process.env.GRAPH_APP_ID;

const api = bizSdk.FacebookAdsApi;

const IGUser = api.InstagramUser;
const showDebugingInfo = true; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  IGUser.setDebug(true);
}
const logApiCallResult = (apiCallName, data) => {
  console.log(apiCallName);
  if (showDebugingInfo) {
    console.log('Data:' + JSON.stringify(data));
  }
};

let fields, params;
fields = [
  'biography','id','ig_id','name','profile_picture_url','username','website'
];
params = {
  'limit' : '30000',
};
export function IGUserInfo() {
    const user =  new IGUser(process.env.GRAPH_PAGE_ID);

    logApiCallResult('locationss api call complete.', IGUserInfo);
    return user.read(fields, params).then((user) => {return user});
 }


// const locationss = (new Page(id)).getLocations(
//   fields,
//   params
// );
