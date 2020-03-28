# Meanderer

A micro-library for scaling [CSS motion path](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Motion_Path) strings ✨

![popsicle with "stay cool..." lettering travelling around its path](./assets/stay-cool.gif)

## Installation
### CDN
```shell
https://unpkg.com/meanderer@0.0.1/dist/meanderer{.min}.js
```
### NPM
```
npm i meanderer
```

## Usage

```js
// Our path string
const PATH = "M32.074 13.446s-2.706-2.965-4.158-4.349c-2.003-1.908-3.941-3.942-6.268-5.437C19.33..."
// The bounds of our path
const WIDTH = 65
const HEIGHT = 30
// Generate a responsive path
const responsivePath = new Meanderer({
  path: PATH,
  width: WIDTH,
  height: HEIGHT
})
// Generate a new scaled path when required. Here we are using ResizeObserver
// with a container that uses viewport units
const setPath = () => {
  const scaledPath = responsivePath.generatePath(
    CONTAINER.offsetWidth,
    CONTAINER.offsetHeight
  )
  // Here, we apply the path to an element through a CSS variable.
  // And then an element picks up on that. We could apply the motion path straight to the element though.
  CONTAINER.style.setProperty("--path", `"${scaledPath}"`)
}
// Set up our Resize Observer that will get the ball rolling
const SizeObserver = new ResizeObserver(setPath)
// Observe! Done!
SizeObserver.observe(CONTAINER)
```

First things first. We need a `path`.
Unless you're constructing one by hand, it's likely you'll be extracting one from an `SVG`.

Before extracting one from an `SVG`, it's wise to run that `SVG` through an optimizer like [SVGOMG](https://jakearchibald.github.io/svgomg/)(Use the precision slider for extra gains! 💪). This will normalize coordinates, etc. removing any translations which could skew the path translation.

Now you've got a `path` string, it's time to use it!
1. Create variables for the `path`, and a desired `width` and `height` for the `path` bounds. The `width` and `height` are in most cases going to be the `x2` and `y2` of your SVG's `viewBox` attribute.
  ```js
    const PATH = "M32.074 13.446s-2.706-2.965-4.158-4.349c-2.003-1.908-3.941-3.942-6.268-5.437C19.33..."
    // The bounds of our path
    const WIDTH = 65
    const HEIGHT = 30
  ```
2. Create a new responsive path by passing those variables inside an `Object` to a __new__ `Meanderer` instance.
  ```js
    // Generate a responsive path
    const responsivePath = new Meanderer({
      path: PATH,
      width: WIDTH,
      height: HEIGHT
    })
  ```
3. Use your instance to generate scaled path strings for a given `width` and `height` 👍
  ```js
    responsivePath.generatePath(200, 400)
  ```
4. Pass that to your element either directly or via CSS variable, etc. 🎉


## Caveats
`Meanderer` will do its best to maintain aspect ratio of your paths. If the container dimensions passed in to `generatePath` don't match the aspect ratio of the `path`, `Meanderer` will handle this. It will do this by padding out the container and centering the `path` for you.

A way to enforce the correct aspect ratio for your container is to use your defined `width` and `height` in your CSS. Consider a container with a `width` of `25vmin`. You've specified a `width` and `height` of `64` and `35`.
```css
.container {
  height: calc((64 / 35) * 25vmin);
  width: 25vmin;
}
```

`stroke-path` isn't currently taken into consideration. There have been experiments trying it out though. They didn't seem to affect the overall experience/result though.

## Contributing
I'd love some contributions if you think this micro-library could be useful for you! Leave an issue or open a PR 👍

--------

MIT Licensed | Made with 💻 by @jh3y 2020