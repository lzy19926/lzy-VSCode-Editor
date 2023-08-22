/*
 * @Author: Luzy
 * @Date: 2023-08-21 21:21:50
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 15:48:43
 * @Description: electron-forge构建配置
 */
module.exports = {
  packagerConfig: {
    "asar": true
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {}
    }
  ],
};
