'use strict';

let fs = require('fs');

export default class extends think.base {
	init(name) {
		this.fileName = '/static/record/' + name + '.html';
		this.file = fs.openSync(think.RESOURCE_PATH + this.fileName, 'a');
		fs.write(this.file, '<style type="text/css">.feInfo{color:black;} .feSuccess{color:green;} .feFail{color:red;}</style>');
	}

	title(message) {
		fs.write(this.file, '<p class="feInfo"><h2>' + message + '</h2></p> <hr />');
	}

	info(message) {
		fs.write(this.file, '<p class="feInfo">' + message +'</p>');
	}

	fail(message) {
		fs.write(this.file,'<p class="feFail">' + message +'</p>');
	}

	success(message) {
		fs.write(this.file, '<p class="feSuccess">' + message +'</p>');
	}

	close() {
		fs.closeSync(this.file);
	}
}