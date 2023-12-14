module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'prettier',
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        camelcase: 0,
        'react/prop-types': 0,
        'no-plusplus': 0,
        'no-shadow': 0,
        'no-unused-vars': 1,
        'no-undef': 1,
        'no-use-before-define': ['error', { functions: false }],
    },
};
