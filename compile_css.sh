BOOTSTRAP=./docs/assets/css/bootstrap.css
BOOTSTRAP_MIN=./docs/assets/css/bootstrap.min.css
BOOTSTRAP_LESS=./less/bootstrap.less
BOOTSTRAP_RESPONSIVE=./docs/assets/css/bootstrap-responsive.css
BOOTSTRAP_RESPONSIVE_MIN=./docs/assets/css/bootstrap-responsive.min.css
BOOTSTRAP_RESPONSIVE_LESS=./less/responsive.less

cd ../bootstrap/
cp ../osomtalk/public/css/variables.less less/variables.less
./node_modules/.bin/recess --compile ${BOOTSTRAP_LESS} --compress true > ${BOOTSTRAP_MIN}
./node_modules/.bin/recess --compile ${BOOTSTRAP_RESPONSIVE_LESS} --compress true > ${BOOTSTRAP_RESPONSIVE_MIN}
./node_modules/.bin/recess --compile ${BOOTSTRAP_LESS} > ${BOOTSTRAP}
./node_modules/.bin/recess --compile ${BOOTSTRAP_RESPONSIVE_LESS} > ${BOOTSTRAP_RESPONSIVE}
cp docs/assets/css/bootstrap*.css ../osomtalk/public/css/
cd ../osomtalk/
