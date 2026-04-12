const Jimp = require('jimp');

async function makeTransparent() {
  try {
    const image = await Jimp.read('app/icon.png');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      if (r >= 220 && g >= 220 && b >= 220) {
        this.bitmap.data[idx + 3] = 0; 
      }
    });

    await image.writeAsync('app/icon.png');
    console.log('Transparency applied successfully!');
  } catch (err) {
    if (err.message && err.message.includes('writeAsync')) {
      // Fallback for older jimp
      Jimp.read('app/icon.png').then(img => {
        img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
          const r = this.bitmap.data[idx + 0];
          const g = this.bitmap.data[idx + 1];
          const b = this.bitmap.data[idx + 2];
          if (r >= 220 && g >= 220 && b >= 220) {
            this.bitmap.data[idx + 3] = 0; 
          }
        });
        img.write('app/icon.png', () => console.log('Transparency applied securely.'));
      });
    } else {
      console.error(err);
    }
  }
}
makeTransparent();
