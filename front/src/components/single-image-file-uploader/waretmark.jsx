export const watermark = async ({
  file,
  watermarkText = '',
  width = 300,
  height = 300,
}) => {

  // Use 'FileReader' to read image BLOB data as dataurl
  console.log('watermark file income', file);
  const reader = new FileReader();

  file && reader?.readAsDataURL(file);

  // Create img tag with SRC attribute of dataurl
  const tempImg = await new Promise((resolve) => {
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      resolve(img);
    };
  });

  // Monitoring` img.onload `, create the canvas
  // and put the IMG object 'draw' in the canvas
  const canvas = await new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = tempImg.width || width;
    canvas.height = tempImg.height || height;

    tempImg.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.drawImage(tempImg, 0, 0);

      // Add watermark
      ctx.fillStyle = 'red';
      ctx.textBaseline = 'middle';
      ctx.font = '14px Calibri';
      ctx.fillText(watermarkText, 5, 10);
      resolve(canvas);
    };
  });

  // Use` canvas.toBlob `Turn to final image
  const newImg = await new Promise((resolve) => {
    canvas.toBlob((canvasBlob) => {
      const newFile = new File([ canvasBlob ], file?.name || 'image', {
        type: canvasBlob.type,
      });
      resolve(newFile);
    });
  });
  return newImg || {};
};
