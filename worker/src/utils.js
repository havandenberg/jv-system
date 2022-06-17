const onError = (e) => {
  console.log(e);
  console.log(e.response.errors);
};

const CHUNK_SIZE = 200;

const getSlicedChunks = (items, chunkSize = CHUNK_SIZE) =>
  [...Array(Math.ceil(items.length / chunkSize))].map((_, idx) =>
    items.slice(idx * chunkSize, idx * chunkSize + chunkSize),
  );

module.exports = {
  getSlicedChunks,
  onError,
};
