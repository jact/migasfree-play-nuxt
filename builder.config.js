const NUXT_SSR_MODE = require ('./.electron-nuxt/config').NUXT_SSR_MODE
const ICONS_DIR = 'build/icons/'

const windowsOS = {
  win: {
    icon: ICONS_DIR + 'win-icon.ico',
    publisherName: 'jact',
    target: 'nsis'
  },

  nsis: {
    differentialPackage: true
  }
}

const linuxOS = {
  linux: {
    icon: 'src/renderer/static/img/migasfree-play.svg',
    target: ['deb'/*, 'rpm'*/],
    //arch: ['x64'],
    category: 'System'
  },
  deb: {
    depends: [
      "migasfree-client (>= 5.0)",
      "sudo",
      "bash",
      "cron"
    ],
    packageCategory: "utils",
    priority: "optional",
    desktop: {
      name: "Migasfree Play",
      exec: "/opt/migasfree-play/migasfree-play --no-sandbox"
    }
  }
}

const macOS = {
  mac: {
    target: 'dmg',
    icon: ICONS_DIR + 'con.icns'
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ]
  }
}

const files = [
  'package.json',
  {
    from: 'dist/main/',
    to: 'dist/main/'
  },
  {
    from: 'src/resources/',
    to: 'dist/resources/'
  }
]

// if not SSR mode, add nuxt generate dist to Electron
if (!NUXT_SSR_MODE) {
  files.push({
    from: 'dist/renderer',
    to: 'dist/renderer/'
  })
}

module.exports = {
  asar: false,
  productName: 'migasfree-play',
  appId: 'org.migasfree.migasfree-play',
  artifactName: 'migasfree-play-${version}.${ext}',
  directories: {
    output: 'build'
  },
  // default files: https://www.electron.build/configuration/contents
  files,
  ...windowsOS,
  ...linuxOS,
  ...macOS
}
