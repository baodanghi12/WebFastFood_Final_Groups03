// Core assets - using absolute paths from the public folder
const logo = "/assets/logo.png";
const arrow_icon = "/assets/arrow_icon.svg";
const lock_icon = "/assets/lock_icon.svg";
const mail_icon = "/assets/mail_icon.svg";
const person_icon = "/assets/person_icon.svg";
const hand_wave = "/assets/hand_wave.png";
const header_img = "/assets/header_img.png";

// Placeholders
const foodPlaceholder = "/assets/placeholders/food-placeholder.jpg";
const drinkPlaceholder = "/assets/placeholders/drink-placeholder.jpg";
const dessertPlaceholder = "/assets/placeholders/dessert-placeholder.jpg";

// Food images
const phobo = "/assets/foods/phobo.jpeg";
const buncha = "/assets/foods/buncha.jpeg";
const comtam = "/assets/foods/comtam.jpeg";
const goicuon = "/assets/foods/goicuon.jpeg";
const banhmi = "/assets/foods/banhmi.jpeg";
const bunbohue = "/assets/foods/bunbohue.jpeg";
const miquang = "/assets/foods/miquang.jpeg";
const chaolong = "/assets/foods/chaolong.jpeg";
const banhcuon = "/assets/foods/banhcuon.jpeg";
const banhxeo = "/assets/foods/banhxeo.jpeg";
const bunrieu = "/assets/foods/bunrieu.jpeg";
const banhcanh = "/assets/foods/banhcanh.jpeg";
const hutieu = "/assets/foods/hutieu.jpeg";
const bunthitnuong = "/assets/foods/bunthitnuong.jpeg";
const comga = "/assets/foods/comga.jpeg";
const banhdacua = "/assets/foods/banhdacua.jpeg";
const banhtrangtron = "/assets/foods/banhtrangtron.jpeg";

// Drink images
const trasuatranchau = "/assets/drinks/trasuatranchau.jpeg";
const caphesua = "/assets/drinks/caphesua.jpeg";
const nuocmia = "/assets/drinks/nuocmia.jpeg";
const sinhtobo = "/assets/drinks/sinhtobo.jpeg";
const nuoccam = "/assets/drinks/nuoccam.jpeg";
const tradao = "/assets/drinks/tradao.jpeg";
const suadaunanh = "/assets/drinks/suadaunanh.jpeg";
const nuocdua = "/assets/drinks/nuocdua.jpeg";
const trachanh = "/assets/drinks/trachanh.jpeg";
const sodachanh = "/assets/drinks/sodachanh.jpeg";
const nuocepdua = "/assets/drinks/nuocepdua.jpeg";
const traxanh = "/assets/drinks/traxanh.jpeg";
const cacaonong = "/assets/drinks/cacaonong.jpeg";
const suatuoitranchau = "/assets/drinks/suatuoitranchau.jpeg";
const nuocepoi = "/assets/drinks/nuocepoi.jpeg";
const trasuamatcha = "/assets/drinks/trasuamatcha.jpeg";
const nuocepcarot = "/assets/drinks/nuocepcarot.jpeg";

// Dessert images
const che3mau = "/assets/desserts/che3mau.jpeg";
const banhflan = "/assets/desserts/banhflan.jpeg";
const kemdua = "/assets/desserts/kemdua.jpeg";
const chekhucbach = "/assets/desserts/chekhucbach.jpeg";
const banhchuoinuong = "/assets/desserts/banhchuoinuong.jpeg";
const chethai = "/assets/desserts/chethai.jpeg";
const banhdayhon = "/assets/desserts/banhdaylon.jpeg"; // Fixed filename
const chedaudo = "/assets/desserts/chedaudo.jpeg";
const pudding = "/assets/desserts/pudding.jpeg";
const chebuoi = "/assets/desserts/chebuoi.jpeg";
const flantraxanh = "/assets/desserts/flantraxanh.jpeg";
const chesuongsahatluu = "/assets/desserts/chesuongsahatluu.jpeg";
const mochi = "/assets/desserts/mochi.jpeg";
const chetroinuoc = "/assets/desserts/chetroinuoc.jpeg";
const banhtrung = "/assets/desserts/banhtrung.jpeg";
const chebap = "/assets/desserts/chebap.jpeg";

export const assets = {
  // Core assets
  arrow_icon,
  lock_icon,
  logo,
  mail_icon,
  person_icon,
  hand_wave,
  header_img,

  // Food images
  phobo,
  buncha,
  comtam,
  goicuon,
  banhmi,
  bunbohue,
  miquang,
  chaolong,
  banhcuon,
  banhxeo,
  bunrieu,
  banhcanh,
  hutieu,
  bunthitnuong,
  comga,
  banhdacua,
  banhtrangtron,

  // Drink images
  trasuatranchau,
  caphesua,
  nuocmia,
  sinhtobo,
  nuoccam,
  tradao,
  suadaunanh,
  nuocdua,
  trachanh,
  sodachanh,
  nuocepdua,
  traxanh,
  cacaonong,
  suatuoitranchau,
  nuocepoi,
  trasuamatcha,
  nuocepcarot,

  // Dessert images
  che3mau,
  banhflan,
  kemdua,
  chekhucbach,
  banhchuoinuong,
  chethai,
  banhdayhon,
  chedaudo,
  pudding,
  chebuoi,
  flantraxanh,
  chesuongsahatluu,
  mochi,
  chetroinuoc,
  banhtrung,
  chebap,

  // Placeholders
  foodPlaceholder,
  drinkPlaceholder,
  dessertPlaceholder,
};

// Helper function to get image path or fallback to placeholder
export const getImagePath = (filename, category = "food") => {
  if (!filename) {
    return getPlaceholder(category);
  }

  // If it's already a full path starting with '/', return as is
  if (filename.startsWith("/assets/")) {
    return filename;
  }

  // Try to find in the assets object
  const baseName = filename.split("/").pop().split(".")[0].toLowerCase();
  const imageKey = Object.keys(assets).find(
    (key) => key.toLowerCase() === baseName
  );

  if (imageKey) {
    return assets[imageKey];
  }

  return getPlaceholder(category);
};

// Get appropriate placeholder based on category
const getPlaceholder = (category) => {
  switch (category.toLowerCase()) {
    case "drink":
      return assets.drinkPlaceholder;
    case "dessert":
      return assets.dessertPlaceholder;
    default:
      return assets.foodPlaceholder;
  }
};
