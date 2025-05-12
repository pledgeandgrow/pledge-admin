export const loadLogoForPDF = async () => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      reject(new Error('Failed to load logo'));
    };
    img.src = '/logo/Logo-black.png';
  });
};

export const generateDevisNumber = (prefix = 'D', digits = 6) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const randomDigits = Math.floor(Math.random() * Math.pow(10, digits)).toString().padStart(digits, '0');
  return `${prefix}-${year}${month}-${randomDigits}`;
};
