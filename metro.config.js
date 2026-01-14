const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro"); // <--- Cambia 'utils' por 'metro'

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "style/global.css" });
