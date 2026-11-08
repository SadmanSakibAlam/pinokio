const { app } = require('electron')

// =========================================================================
// Antigravity Zero-Latency & Extreme Performance Hardware Acceleration Flags
// =========================================================================
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('ignore-gpu-blocklist')
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-zero-copy')
  app.commandLine.appendSwitch('num-raster-threads', '2')
  app.commandLine.appendSwitch('disable-features', 'DropInputEventsWhilePaintHolding,CalculateNativeWinOcclusion')
  app.commandLine.appendSwitch('js-flags', '--max-old-space-size=2048')
  console.log('[PINOKIO PERF] Windows 11 & Intel HD Graphics 520 zero-latency flags active')
}

const Pinokiod = require("pinokiod")
const config = require('./config')
const pinokiod = new Pinokiod(config)

if (process.platform === 'linux') {
  console.log('[PINOKIO DEBUG] Linux startup')
  console.log('[PINOKIO DEBUG] ELECTRON_OZONE_PLATFORM_HINT:', process.env.ELECTRON_OZONE_PLATFORM_HINT || '<unset>')
  console.log('[PINOKIO DEBUG] ELECTRON_DISABLE_GPU:', process.env.ELECTRON_DISABLE_GPU || '<unset>')
  console.log('[PINOKIO DEBUG] DISPLAY:', process.env.DISPLAY || '<unset>')
  console.log('[PINOKIO DEBUG] WAYLAND_DISPLAY:', process.env.WAYLAND_DISPLAY || '<unset>')
  console.log('[PINOKIO DEBUG] argv:', process.argv.join(' '))
  app.disableHardwareAcceleration()
}

let mode = pinokiod.kernel.store.get("mode") || "full"
//iprocess.env.PINOKIO_MODE = process.env.PINOKIO_MODE || 'desktop';
if (mode === 'minimal' || mode === 'background') {
  require('./minimal');
} else {
  require('./full');
}
