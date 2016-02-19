'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
   	return this.redirect('/test_case/');
   }

  listAction() { 
    let pkgs = this.enmuDir();
    var ret = {
      page:1,
      total:1,
      records: 0,
      rows:[]
    };
    for (var i in pkgs) {
      var cs = this.enmuDir(pkgs[i], '.json');
      ret.records += cs.length;
      for (var j in cs) {
        ret.rows.push({cell:[pkgs[i], cs[j]]});
      }
    }
    this.end(ret);
  }

  getFileExt(file_name){
    var index1=file_name.lastIndexOf(".");  
    var index2=file_name.length; 
    var postf=file_name.substring(index1,index2);//后缀名  
    return postf;
  }

  enmuDir(dir, ext) {
    var fs = require('fs');
    var path = this.config('case_root');  
    var cases = new Array;
    if (dir) path += dir + '/' ;
    if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
      cases = fs.readdirSync(path);
      var stat;
      for (var i in cases) {
        stat = fs.statSync(path + cases[i]);
        if (ext) {
          if (!stat.isFile() || ext != this.getFileExt(cases[i])) {
            cases.splice(i, 1);
          }
        } else if(!stat.isDirectory()){
          cases.splice(i, 1);
        }
      }
    }
    return cases;
  }

  showPkg(pkg) {
    return this.enmuDir(pkg, '.json');
  }

  addAction() {
    var pkg = this.param('name');
    if (pkg) {
      var fs = require('fs');
      var path = this.config('case_root');
      path += pkg + '/' ;
      if(!fs.existsSync(path)) {
        fs.mkdirSync(path);
        this.success();
      } else {
        this.fail(102, 'The same name package is exist.');
      }
    } else {
      this.fail(101, 'Can not found package name');
    }
  }

  removeAction() {
    var pkg = this.param('name');
    if (pkg) {
      var fs = require('fs');
      var path = this.config('case_root');
      path += pkg + '/' ;
      if(fs.existsSync(path)) {
        fs.rmdirSync(path);
        this.success();
      } else {
        this.fail(102, 'The package is note exist.');
      }
    } else {
      this.fail(101, 'Invalid request.');
    }
  }

  renameAction() {
    var oldName = this.param('old');
    var newName = this.param('new');
  }
}