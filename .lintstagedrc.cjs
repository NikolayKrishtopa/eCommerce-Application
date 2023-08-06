module.exports = {
  '*.{ts,tsx}': ['prettier --check', 'eslint'],
  '*.{html,css,scss}': ['prettier --write'],
}
