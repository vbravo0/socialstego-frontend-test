# Imprime cada comando que ejecuta
set -x

echo "START PRODUCTION"

# React app en modo produccion
export REACT_APP_FLICKR_API_KEY=$RENDER_FLICKR_API_KEY
npm run start:cloud