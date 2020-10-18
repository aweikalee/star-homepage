const autoprefixer = require('autoprefixer')
const package = require('./package.json')

module.exports = {
    plugins: [
        autoprefixer({
            overrideBrowserslist: package.browserslist,
        }),
    ],
}
