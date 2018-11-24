
const sourceDir = 'source';
const destDir = 'dest';

// load in some libs
const path = require('path');
const fs = require('fs-extra');
const parse = require('csv-parse');
const moment = require('moment');

// read and parse csv file, using first row as column names
const data = fs.readFileSync('calls.csv', 'utf8');
const parser = parse(data, { columns: true });

parser.on('readable', () => {
    let record;
    while (record = parser.read()) {
        // decode date in whatever format it comes in
        let date = moment(record['Date'], 'DD/MM/YYYY hh:mm:ss');
        // it might be an idea to remove characters from the customer that have trouble being in filenames
        let customer = record['Customer'].replace(/[:\//*?()"|`~$]+/g, '_')
        // build source and dest filenames
        let sourceFilename = path.join(sourceDir, record['Filename']);
        let destFilename = path.join(destDir, customer, date.format('MM'), path.basename(record['Filename']));
        // print the old and new filenames out
        console.log(sourceFilename, destFilename);
        // make dest directory
        fs.mkdirpSync(path.dirname(destFilename));
        // copy file, can make it fail if a file with that name already exists
        fs.copySync(sourceFilename, destFilename, { errorOnExist: true, preserveTimestamps: true });
        // OR move (by renaming)
        //fs.renameSync(sourceFilename, destFilename);
    }
});

