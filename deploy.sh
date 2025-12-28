#!/bin/bash

# PRODUCTION
# git reset --hard 
# git checkout master
# git pull origin master

if ! command -v yarn &> /dev/null; then
    npm i yarn -g
fi

# Install serve if not present
yarn global add serve

if ! command -v pm2 &> /dev/null; then
    yarn global add pm2
fi

yarn
yarn run build
pm2 start "yarn run start:prod" --name=WEAR-IT-REACT
