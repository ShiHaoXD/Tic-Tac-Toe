import common from "./webpack.common";
import merge from "./webpack-merge";
// 压缩js的插件
import TerserJSPlugin from "terser-webpack-plugin";
// 压缩css的插件
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";

export default merge(common, {
	mode: "production",
	optimization: {
		minimizer: [new TerserJSPlugin({}), new OptimizeCssAssetsPlugin({})],
	},
});
