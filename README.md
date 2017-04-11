## Expression Atlas Experiment Page

Experiment page code for baseline, proteomics baseline and differential gene expression experiments for [Expression
Atlas](http://www.ebi.ac.uk/gxa).

It is quite coupled to the Expression Atlas's webapp code but you could see a way to reuse bits of it in your project.

### Atlas Widget

The heatmap that this page uses can be included as a widget as part of your website. See
[atlas-heatmap repository](https://github.com/gxa/atlas-heatmap)

### Development

#### Getting started
`git pull` the repository and `npm install` in the main directory.

`webpack-dev-server` will serve you the test pages.
If you're working on both the frontend and the backend you will occasionally need to update them. You can edit them by hand or grab the config from e.g.
`view-source:http://localhost:8080/gxa/experiments/E-MTAB-513`

#### Demo pages
Aren't doing great at the moment, we'd need to - I think - set the react-router to have a specific basename and set webpack-dev-server to serve the right page and not just always index.html.
This works:
```
http://localhost:9000/gxa/experiments/E-PROT-1
```

### License

Apache 2.0.
