2018-06-04 - Getting Config in order:

FIXME: NORMALIZE CONFIG:

There are client configs we need to put in order, please look for these:
  environment.api_url
  apiURI
  BASE_URI: getHost(),
  BASE_API: apiURI

// Also:

cd ~/dev/bp/bp && rosty$ ng build --prod && echo OK OK OK && rm -rf fbs/dist/ && echo OK OK && mv dist/ fbs/ && echo OK

cd ~/dev/bp/bp && firebase serve

// Run confugurations:

1. Local debug on local Mongo and Local API
2. Local debug on remote Mongo and FBS API

...

ng build && rm -rf fbs/dist/ && mv dist/ fbs/

// Local Dev with FB:

cd bp/fb

firebase serve --only functions --port=4300

cd bp/data

mongod --dbpath=db

cd bp

npm run ng-serve

Chrome for localhost CORS:

open /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir