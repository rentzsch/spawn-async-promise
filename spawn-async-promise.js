var childProcess = require('child_process');
var Promise = require('bluebird');

module.exports = function spawnAsync(command, args, opts) {
    if (typeof args === 'undefined') {
        args = [];
    }
    if (typeof opts === 'undefined') {
        opts = {};
    }
    return new Promise(function(resolve, reject){
        var stdoutString = '';
        var stderrString = '';
        //console.log('$ '+command+' '+args.join(' '));
        var child = childProcess.spawn(command, args, opts);
        
        child.stdout.on('data', function(data){
            stdoutString += data.toString();
        });
        child.stderr.on('data', function(data){
            stderrString += data.toString();
        });
        child.on('close', function(exitCode) {
            //console.log('! '+exitCode+' '+command+' '+args.join(' '));
            var result = {
                command: command,
                args: args,
                opts: opts,
                code: exitCode,
                stdout: stdoutString,
                stderr: stderrString,
            };
            if (exitCode === 0 || opts.ignoreExitCode) {
                if (typeof opts.resolveValue === 'undefined') {
                    resolve(result);
                } else {
                    resolve(opts.resolveValue);
                }
            } else {
                reject(result);
            }
        });
    });
};