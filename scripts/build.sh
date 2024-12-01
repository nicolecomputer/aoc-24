#!/usr/bin/env bash

rm -rf build/
git clone https://github.com/nicolecomputer/showoff.git build/

cd build
yarn install
rm -rf problems
cd ../
pwd

cp -r src/ build/problems
rm -rf build/problems/lib

cd build
yarn build
