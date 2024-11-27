const { globSync, glob } = require('glob')
const { series, src, dest, watch } = require('gulp');
const ts = require('typescript')
const path = require('path')
const fs = require('fs');
const exec = require('node:child_process').exec;

const dist = path.join(__dirname, 'dist')

const ts_options = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.CommonJS,
  moduleResolution : ts.ModuleResolutionKind.Node10,
  strict : true,
  esModuleInterop : true,
  noImplicitAny : true,
}

function clean(cb) {
  fs.stat(dist, (err, stat) => {
    if(err && err.code == 'ENOENT') {
      cb()
    }
    fs.rmSync(dist, {force : true, recursive : true})
    cb()
  })
}

function transpileTs(cb) {

  fs.mkdir(dist, (err) => {
    if(err) { return cb(new Error(err.message))}
    glob('./src/**/*.ts').then((ts_file) =>{
      for (const file of ts_file) {
        const dir = path.dirname(file)
        const file_name = path.basename(file).split('.')[0]
        fs.stat(path.join(dist, dir), (err, stat) => {
          if(err && err.code == 'ENOENT') {
            const sub_path_dir = path.join(dist, dir)
            fs.mkdir(sub_path_dir, (err) => {
              if(err && err.code != 'EEXIST') { return cb(new Error(err.message))}
              const full_path = path.join(dist ,dir , `${file_name}.js`,)
              fs.readFile(file, 'utf8', (err, data) =>{
                if(err) { return cb(new Error(err.message))}
                // const input =  ts.transpileModule(data, {compilerOptions : ts_options})
                const input =  ts.transpile(data,  ts_options)
                // console.log(input)
                fs.writeFile(full_path, input, 'utf-8', (err) => {
                  if(err) { return cb(new Error(err.message))}
                  cb()
                })
              })
            })
          }
        })
      }
      cb();
    })
  })
}

function copyViews () {
  return src('src/renderer/views/*.html').pipe(dest(path.join(dist, 'src', 'renderer', 'views')))
}

function compiteCSS(cb) {
  return src('src/renderer/asset/*.css').pipe(dest(path.join(dist, 'src', 'renderer', 'asset')))

}

exports.default = function() {
  watch('src/**/*', series(clean, 
    transpileTs,
    compiteCSS, 
    copyViews,
  ))
}