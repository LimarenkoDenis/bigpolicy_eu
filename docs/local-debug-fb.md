Local Dev with FB:

cd bp/fb

firebase serve --only functions --port=4300

cd bp/data

mongod --dbpath=db

cd bp

npm run ng-serve


Chrome for localhost CORS:

open /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir


============

var prod = true;
 // remote Mongo:
 var MNG_URL = 'mongodb://bpqa:bpqa81@ds119436.mlab.com:19436/bpqa';
 // local Mongo:
 var MNG_URL = 'mongodb://localhost:27027/bigpolicy';

 export const environment = {
    production: false,		    production: false,
 -  api_url: 'http://localhost:4300/bigpolicy-qa/us-central1/appExpress'		 +  api_url: 'http://localhost:4300'
  };
};