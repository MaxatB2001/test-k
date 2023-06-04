const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const { shareAll } = require("@angular-architects/module-federation/webpack");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, "tsconfig.json"), [
  /* mapped paths to share */
]);

module.exports = {
  output: {
    uniqueName: "ais_mfr_kanban_admin",
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  experiments: {
    outputModule: true,
  },
  
  plugins: [
    new ModuleFederationPlugin({
      library: { type: "module" },
      
      // For remotes (please adjust)
      name: "ais_mfr_kanban_admin",
      
      filename: "remoteEntry.js",
      exposes: {
        "./KanbanAdminModule": "./src/app/kanban-admin/kanban-admin.module.ts",
      },

      // For hosts (please adjust)
      // remotes: {
      //     "mfe1": "http://localhost:3000/remoteEntry.js",

      // },

      shared: 

      share({
        "@angular/core": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/common": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/common/http": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/router": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "keycloak-angular": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        // "@angular/animations": {singleton: true, strictVersion: true, requiredVersion: 'auto'},
        // '@angular/platform-browser/animations':{singleton: true, strictVersion: true, requiredVersion: 'auto'},
        ...sharedMappings.getDescriptors(),
      }),
    }),
    sharedMappings.getPlugin(),
  ],
}