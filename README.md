# Appye Version 5.0.0
Appye is a mess of persistent "OS-like" JavaScript.
Appye stores all of its data in `navigator.storage.getDirectory();`, only Chrome is supported at the moment.
Appye also uses services workers to allow you to use any file in the `navigator.storage.getDirectory();` as a "real file hosted on a server".

## Default Apps
- `App Installer` - Install apps from ZIP files.
- `List of Apps` - List all installed apps, and open them.
- `Google` - Google search, just iframes google.com.
- `Desmos` - Desmos graphing calculator, just a iframe.
- `Mah` - A html5 mahjong solitaire game, under [M.I.T. license](https://github.com/ffalt/mah/blob/main/LICENSE). Source code is available [here](https://github.com/ffalt/mah).