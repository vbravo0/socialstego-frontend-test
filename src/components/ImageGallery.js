import { Box, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { useEffect, useState } from 'react';
import * as flickr from '../api/flickrAPI'
import JSONHandler from '../JSONHandler';
const json_model = require('../model/out/model.json');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-backend-wasm');
const pixels = require('image-pixels')

const ImageGallery = ({ username }) => {
  const [photos, setPhotos] = useState([])
  const [model, setModel] = useState();

  useEffect(() => {
    tf.ready().then(() => {
      const handler = new JSONHandler(JSON.stringify(json_model));
      tf.loadLayersModel(handler).then((model) => {
        setModel(model)
        model.summary()
        console.log("weights")
        console.log(model.getWeights())
      }).catch(e => console.log('Error: No cargó el modelo', e))
    }).catch(e => console.log("Error: Tensorflow WASM not ready", e))
  }, [])

  useEffect(() => {
    const classify = async (pix) => {
      // PREDICCIÓN
      // Uint8Array -> Tensor 3D RGBA [x,y,4]
      const rgbaTens3d = tf.tensor3d(pix.data, [pix.width, pix.height, 4]);
      // Tensor 3D RGBA [x,y,4] -> Tensor 3D RGB [x,y,3]
      const rgbTens3d = tf.slice3d(rgbaTens3d, [0, 0, 0], [-1, -1, 3])
      // Tensor 3D RGB [x,y,3] -> Tensor 3D RGB [100,100,3]
      const smallImg = tf.image.resizeBilinear(rgbTens3d, [32, 32]);
      // Tensor 3D RGB [100,100,3] -> Tensor 4D RGB [1,100,100,3]
      const tensor = smallImg.reshape([1, 32, 32, 3])
      const prediction = model.predict(tensor).dataSync()[0];
      return prediction;
    }

    const f = async () => {
      if (!(username && model)) { return }
      const MAX_PHOTOS = 8;
      const userID = await flickr.getUserID(username);
      const imgs = await flickr.getPhotoIDAndTitle(userID, MAX_PHOTOS);
      const sources = await Promise.all(imgs.map(async p => {
        const sizes = await flickr.getSizes(p.id);
        const src = sizes.filter(x => x.label === 'Medium')[0].source; 
        const pix = await pixels(src);
        const prediction = await classify(pix);

        const stegoFilter = " grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)"
        const filter = parseInt(prediction) % 2 === 0 ? stegoFilter : "";
        return {
          sizes: sizes,
          title: p.title,
          filter: filter,
        }
      }))
      setPhotos(sources)
    }
    f()
  }, [username, model])

  return (
    <Box>
      <ImageList sx={{ width: '100%', height: 400 }} cols={4}>
        {photos.map((photo) => (
          <ImageListItem key={photo.title}>
            <img
              src={photo.sizes.filter(x => x.label === 'Medium')[0].source}
              loading="lazy"
              alt={photo.title}
              style={{ filter: photo.filter }}
            />
            <ImageListItemBar
              title={photo.title}
              position="bottom"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  )
}

export default ImageGallery;