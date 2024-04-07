# webm2xtwitter

![a screenshot showing the app](https://github.com/jtpio/webm2xtwitter/assets/591645/9c606d96-fd25-4bd2-9803-35bec2e40d3c)

## Usage

TBD

## Motivation

There are several motivations for this project:

- X / Twitter does not support .webm files
- The tool I was using before (Peek) does not support Wayland (the default on recent Linux distributions). And it is also not maintained anymore (https://github.com/phw/peek/issues/1191)
- The default Gnome screen recorder tool works on Wayland, but it does not support exporting to anything else other than .webm

This small projects tries to address the gap of recording a screencast on Wayland in .webm, and be able to post it as a video on X / Twitter.

It's possible to achieve the same by just running `ffmpeg` manually locally in a terminal. But this is tedious and the command should be saved somewhere. Now that `ffmpeg` can run in the browser via WebAssembly, this small app should make it more convenient to handle this process in a browser directly in a more user-friendly way.


## Contributing

Please feel free to contribute! For now the app is pretty barebone and was quickly put together to fullfill the motivation described above.

### Development setup

```bash
# install dependencies
npm i

# download the ffmpeg assets
npm run download

# run the Tailwind watch script
npm run watch:css

# start the server
npm run start
```
